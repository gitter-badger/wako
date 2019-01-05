import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BaseHttpService } from '../../services/http/base-http.service';
import { Torrent } from '../../entities/torrent';
import { TorrentQualityTitleQuery } from './torrent-quality-title.query';
import { Provider } from '../../entities/provider';
import { TorrentsQueryFilter } from '../../services/app/torrent.service';
import { CacheService } from '../../services/cache.service';

class ProviderHttp extends BaseHttpService {
  static queueEnabled = true;

  static getSimultaneousRequest() {
    return 20;
  }
}

export class TorrentFromProviderQuery {
  private static tokenByProvider = new Map<string, ProviderToken>();

  private static replacer(tpl: string, data: { [key: string]: any }) {
    return tpl.replace(/{([^}]+)?}/g, ($1, $2) => {
      return data[$2];
    });
  }

  private static getObjectFromKey(rootObject: Object, keyString: string): any {
    let results = rootObject;
    keyString.split('.').forEach(key => {
      if (results.hasOwnProperty(key)) {
        results = results[key];
      } else {
        results = null;
      }
    });

    return results;
  }

  private static getQuery(provider: Provider, filter: TorrentsQueryFilter) {
    const category = filter.category;

    let query = '';
    if (filter.query) {
      query = filter.query.trim();
    } else {
      const rpl = {
        title: filter.title,
        imdbId: filter.imdbId,
        episodeCode: filter.episodeCode,
        year: filter.year ? filter.year : ''
      };
      if (filter.alternativeTitles) {
        Object.keys(filter.alternativeTitles).forEach(language => {
          rpl['title.' + language] = filter.alternativeTitles[language];
        });
      }

      let keywords = '';
      if (category === 'movies' && provider.movie) {
        keywords = provider.movie.keywords;
      } else if (category === 'tv' && provider.episode) {
        keywords = provider.episode.keywords;
      }

      query = this.replacer(keywords, rpl).trim();
    }

    return query;
  }

  private static _getData(provider: Provider, filter: TorrentsQueryFilter): Observable<Torrent[]> {
    const category = filter.category;

    if (category === 'movies' && !provider.movie) {
      return of([]);
    }

    if (category === 'tv' && !provider.episode) {
      return of([]);
    }

    const query = this.getQuery(provider, filter);

    const isAccurate = category === 'movies' && query.match('imdbId') !== null;

    console.log(`Getting "${query}" on ${category} from ${provider.name} provider`);

    let tokenObs = of(null);

    if (provider.token) {
      tokenObs = ProviderHttp.request(
        {
          method: 'GET',
          url: provider.base_url + provider.token.query,
          responseType: provider.response_type
        },
        provider.token.token_validity_time_ms || null,
        5000,
        true,
        provider.time_to_wait_on_too_many_request_ms,
        provider.time_to_wait_between_each_request_ms
      ).pipe(
        map(response => {
          const _token = response[provider.token.token_format.token];
          this.tokenByProvider.set(provider.name, {
            token: _token,
            generatedDate: new Date()
          });

          console.log(`Token ${_token} get from ${provider.name}`);

          return _token;
        })
      );
    }

    return tokenObs.pipe(
      switchMap(token => {
        let url = provider.base_url + (category === 'movies' ? provider.movie.query : provider.episode.query);

        url = this.replacer(url, {
          query: encodeURIComponent(query),
          token: token
        });

        return ProviderHttp.request<any>(
          {
            method: 'GET',
            url: url,
            responseType: provider.response_type === 'json' ? 'json' : 'text'
          },
          provider.response_type === 'json' ? '1d' : null,
          30000,
          true,
          provider.time_to_wait_on_too_many_request_ms,
          provider.time_to_wait_between_each_request_ms
        ).pipe(
          map(response => {
            const torrents: Torrent[] = [];

            if (provider.json_format) {
              try {
                const results = this.getObjectFromKey(response, provider.json_format.results);

                if (!results) {
                  console.log(
                    `Total torrents found ${torrents.length} for "${query}" on ${category} from ${
                      provider.name
                    } provider`
                  );

                  return torrents;
                }

                results.forEach((result: any) => {
                  const title = result[provider.json_format.title];

                  if (provider.json_format.sub_results) {
                    const subResults = this.getObjectFromKey(result, provider.json_format.sub_results);

                    subResults.forEach(subResult => {
                      const quality = provider.json_format.quality
                        ? subResult[provider.json_format.quality]
                        : TorrentQualityTitleQuery.getData(title);

                      const torrent = <Torrent>{
                        providerName: provider.name,
                        title: title,
                        url: subResult[provider.json_format.url],
                        seeds: +subResult[provider.json_format.seeds],
                        peers: +subResult[provider.json_format.peers],
                        quality: quality,
                        isAccurate: isAccurate
                      };

                      const size = subResult[provider.json_format.size];

                      if (Number(size)) {
                        torrent.size_bytes = +size;
                      } else {
                        torrent.size_str = size;
                      }

                      torrents.push(torrent);
                    });
                  } else {
                    const quality = provider.json_format.quality
                      ? result[provider.json_format.quality]
                      : TorrentQualityTitleQuery.getData(title);

                    const torrent = <Torrent>{
                      providerName: provider.name,
                      title: title,
                      url: result[provider.json_format.url],
                      seeds: +result[provider.json_format.seeds],
                      peers: +result[provider.json_format.peers],
                      size: result[provider.json_format.size],
                      quality: quality,
                      isAccurate: isAccurate
                    };

                    const size = result[provider.json_format.size];

                    if (Number(size)) {
                      torrent.size_bytes = +size;
                    } else {
                      torrent.size_str = size;
                    }

                    torrents.push(torrent);
                  }
                });
              } catch (e) {
                console.log(`Error on provider ${provider.name}`, e, response);
              }
            } else if (provider.html_parser) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(response, 'text/html');

              try {
                const rows = Function('doc', 'code', `return eval(code)`)(doc, provider.html_parser.row) as NodeListOf<
                  HTMLTableRowElement
                >;

                rows.forEach(row => {
                  const title = Function('row', 'code', `return eval(code)`)(row, provider.html_parser.title);

                  let torrentUrl = Function('row', 'code', `return eval(code)`)(row, provider.html_parser.url);

                  if (!torrentUrl.match('magnet')) {
                    torrentUrl = ProviderHttp.request<string>(
                      {
                        method: 'GET',
                        url: torrentUrl,
                        responseType: 'text'
                      },
                      '1d'
                    ).pipe(
                      map(_html => {
                        return _html.match(/(magnet[^"]+)/).shift();
                      })
                    );
                  }

                  const torrent = <Torrent>{
                    providerName: provider.name,
                    title: title,
                    url: torrentUrl,
                    seeds: +Function('row', 'code', `return eval(code)`)(row, provider.html_parser.seeds),
                    peers: +Function('row', 'code', `return eval(code)`)(row, provider.html_parser.peers),
                    quality: TorrentQualityTitleQuery.getData(title),
                    isAccurate: isAccurate
                  };

                  const size = Function('row', 'code', `return eval(code)`)(row, provider.html_parser.size);

                  if (Number(size)) {
                    torrent.size_bytes = +size;
                  } else {
                    torrent.size_str = size;
                  }

                  torrents.push(torrent);
                });
              } catch (e) {
                console.log(`Error on provider ${provider.name}`, e, response);
              }
            }

            console.log(
              `Total torrents found ${torrents.length} for "${query}" on ${category} from ${provider.name} provider`
            );

            return torrents;
          }),
          map((torrents: Torrent[]) => {
            return torrents.filter(torrent => torrent.seeds > 1);
          })
        );
      })
    );
  }

  static getData(provider: Provider, filter: TorrentsQueryFilter): Observable<Torrent[]> {
    const cacheKey = provider.name + '_' + JSON.stringify(filter);
    return CacheService.get<Torrent[]>(cacheKey).pipe(
      switchMap(torrentsFromCache => {
        if (torrentsFromCache) {
          const query = filter.title + '' + (filter.episodeCode ? filter.episodeCode : '');
          console.log(
            `Total torrents found from cache ${torrentsFromCache.length} for "${query}" on ${filter.category} from ${
              provider.name
            } provider`
          );
          return of(torrentsFromCache);
        }

        return this._getData(provider, filter).pipe(tap(torrents => CacheService.set(cacheKey, torrents, '1d')));
      })
    );
  }
}

interface ProviderToken {
  token: string;
  generatedDate: Date;
}
