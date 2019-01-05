import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService } from '../../services/http/base-http.service';
import { Movie } from '../../entities/movie';
import { CacheService } from '../../services/cache.service';

export class RarbgTop100MoviesQuery {
  static getData(): Observable<Movie[]> {
    const params = new URLSearchParams();

    const categoryIds = [48, 17, 44, 45, 47, 42, 46];

    categoryIds.forEach(categoryId => {
      params.append('category[]', categoryId.toString());
    });

    const url = `https://rarbgaccessed.org/top100.php?${params.toString()}`;

    const ajaxRequest = {
      url: url,
      method: 'GET',
      responseType: 'text'
    };

    return BaseHttpService.request<string>(ajaxRequest, '4h', 10000, true).pipe(
      map(html => {
        if (html.match(`Please wait while we try to verify your browser`)) {
          CacheService.remove(BaseHttpService.getObservableKey(ajaxRequest));
          throw Error('Cannot access to rarbg with your provider');
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const trs = doc.querySelectorAll('.lista2t tr') as NodeListOf<HTMLTableRowElement>;

        const movies = [];

        const imdbIds = [];

        Array.from(trs).forEach(tr => {
          const movie: Movie = new Movie();

          movie.isDataComplete = false;

          movie.genres = [];

          const td: HTMLTableCellElement = tr.querySelectorAll('td')[1];

          const a: HTMLAnchorElement = td.querySelectorAll('a')[1];

          if (!a) {
            return;
          }

          const imdbId = a.getAttribute('href').split('=')[1];

          movie.imdbId = imdbId;

          if (imdbIds.indexOf(imdbId) === -1) {
            imdbIds.push(imdbId);
          } else {
            return;
          }

          const aInfo: HTMLAnchorElement = td.querySelectorAll('a')[0];

          if (!aInfo) {
            return;
          }

          movie.images_url = {};

          movie.title = aInfo.textContent;
          movie.title = movie.title.replace(/\./gi, ' ');

          const matches = movie.title.match(/([0-9]{4})/gi);

          movie.year = matches ? +matches[0] : null;

          if (movie.year) {
            movie.title = movie.title.split(movie.year.toString())[0];
          }

          movie.released = tr.querySelectorAll('td')[2].textContent.split(' ')[0];

          const span = td.querySelector('span');

          if (span) {
            const genres = span.textContent.split(', ');

            genres.forEach(genre => {
              if (genre.match('IMDB')) {
                const g = genre.split(' ');
                movie.genres.push(g.shift());
                movie.rating = +g[1].split('/')[0];
              } else {
                movie.genres.push(genre);
              }
            });
          }

          movies.push(movie);
        });

        console.log('total movies found on rarbg top 100', movies.length);

        return movies.sort((m1: Movie, m2: Movie) => {
          if (m1.rating > m2.rating) {
            return -1;
          }
          if (m1.rating < m2.rating) {
            return 1;
          }
          return 0;
        });
      })
    );
  }
}
