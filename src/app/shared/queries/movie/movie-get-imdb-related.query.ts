import { catchError, tap } from 'rxjs/operators';
import { MovieGetByIdQuery } from './movie-get-by-id.query';
import { forkJoin, Observable, of } from 'rxjs';
import { Movie } from '../../entities/movie';

export class MovieGetImdbRelatedQuery {
  static getData(imdbIds: string[]): Observable<Movie[]> {
    const movies: Movie[] = [];

    const obs = [];
    imdbIds.forEach(imbdId => {
      obs.push(MovieGetByIdQuery.getData(imbdId).pipe(tap(movie => movies.push(movie))));
    });

    return forkJoin(...obs).pipe(
      catchError(() => {
        return of(movies);
      })
    );
  }
}
