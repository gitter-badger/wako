import { BaseHttpService } from '../../services/http/base-http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ImdbItemQuery {
  static getData(imdbId: string): Observable<ImdbItem> {
    return BaseHttpService.request<string>(
      {
        url: `https://m.imdb.com/title/${imdbId}/`,
        method: 'GET',
        responseType: 'text'
      },
      '7d',
      10000,
      true
    ).pipe(
      map(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const imdbItem = <ImdbItem>{
          genres: [],
          relatedIds: []
        };

        const genreItems = doc.querySelectorAll('[itemprop="genre"]') as NodeListOf<HTMLSpanElement>;
        genreItems.forEach(node => {
          imdbItem.genres.push(node.innerText);
        });

        const ratingItem = doc.querySelectorAll('#ratings-bar span')[1] as HTMLSpanElement;
        const rattingParts = ratingItem.innerText.split('/10');
        imdbItem.rating = +rattingParts[0].replace(',', '.');
        imdbItem.votes = +rattingParts[1].replace(/[^0-9]*/gi, '');

        const recItems = doc.querySelectorAll('#sims .ribbonize') as NodeListOf<HTMLDivElement>;
        recItems.forEach(node => {
          if (node.hasAttribute('data-tconst')) {
            const imbdId = node.getAttribute('data-tconst');
            imdbItem.relatedIds.push(imbdId);
          }
        });

        const descriptionEl = doc.querySelector('[itemprop="description"]') as HTMLDivElement;
        if (descriptionEl) {
          imdbItem.description = descriptionEl.innerText.trim();
        }

        return imdbItem;
      })
    );
  }
}

export interface ImdbItem {
  rating: number;
  votes: number;
  relatedIds: string[];
  genres: string[];
  description: string;
}
