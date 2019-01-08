import { TorrentFromProviderQuery } from './torrent-from-provider.query';
import { Provider } from '../../entities/provider';
import { TorrentsQueryFilter } from '../../services/app/torrent.service';

const providerJsonStr = `{
    "name": "My Provider",
    "enabled": true,
    "enabled_in_list": true,
    "languages": [
      "en"
    ],
    "base_url": "https://www.google.com",
    "response_type": "text",
    "movie": {
      "query": "",
      "keywords": "{title} {year}"
    },
    "episode": {
      "query": "{query}/TV/1/",
      "keywords": "{title} {episodeCode}"
    },
    "html_parser": {
      "row": "doc.querySelectorAll('tbody > tr')",
      "title": "row.querySelector('a:nth-child(2)').innerHTML",
      "peers": "row.querySelector('.leeches').innerHTML",
      "seeds": "row.querySelector('.seeds').innerHTML",
      "size": "row.querySelector('tbody > tr .size').textContent.split('B')[0] + 'B'",
      "url": "row.querySelector('a:nth-child(2)').getAttribute('href')"
    }
  }
  `;

const provider = JSON.parse(providerJsonStr) as Provider;

describe('TorrentFromProviderQuery', () => {
  const movieFilter: TorrentsQueryFilter = {
    title: 'Bird Box',
    year: 2018,
    category: 'movies',
    imdbId: '',
    episodeCode: ''
  };

  const movieReplacement = TorrentFromProviderQuery.getProviderReplacement(provider, movieFilter);

  it('should get movie query', () => {
    expect(movieReplacement.query).toBe('bird%20box%202018');
  });

  const tvFilter: TorrentsQueryFilter = {
    title: 'Game of Thrones',
    year: 2018,
    category: 'tv',
    imdbId: '',
    episodeCode: 'S01E01'
  };

  const tvReplacement = TorrentFromProviderQuery.getProviderReplacement(provider, tvFilter);

  it('should get tv query', () => {
    expect(tvReplacement.query).toBe('game%20of%20thrones%20s01e01');
  });

  it('should get torrents', (done: DoneFn) => {
    TorrentFromProviderQuery.doRequest(provider, movieFilter).subscribe(torrents => {
      expect(torrents.length).toBeGreaterThanOrEqual(0);
      done();
    });
  });
});
