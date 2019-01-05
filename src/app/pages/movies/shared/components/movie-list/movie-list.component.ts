import { Component, Input } from '@angular/core';
import { Movie } from '../../../../../shared/entities/movie';

@Component({
  selector: 'wk-movie-list',
  templateUrl: 'movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Input()
  loading;

  @Input()
  virtualScroll = true;

  twinMovies: TwinMovies[] = [];

  _movies: Movie[] = [];

  @Input()
  set movies(movies: Movie[]) {
    this.twinMovies = [];

    let twinMovie: TwinMovies = {
      movie1: null,
      movie2: null
    };
    movies.forEach((movie, index) => {
      if (index % 2 === 0) {
        twinMovie.movie1 = movie;
      } else {
        twinMovie.movie2 = movie;

        this.twinMovies.push(twinMovie);

        twinMovie = {
          movie1: null,
          movie2: null
        };
      }
    });

    if (twinMovie.movie1) {
      this.twinMovies.push(twinMovie);
    }
    this._movies = movies;
  }
}

interface TwinMovies {
  movie1: Movie;
  movie2?: Movie;
}
