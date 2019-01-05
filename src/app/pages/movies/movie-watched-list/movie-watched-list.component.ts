import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../shared/entities/movie';
import { MovieGetWatchedListQuery } from '../../../shared/queries/movie/movie-get-watched-list.query';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'wk-movie-watched-list',
  templateUrl: './movie-watched-list.component.html',
  styleUrls: ['./movie-watched-list.component.scss']
})
export class MovieWatchedListComponent implements OnInit {
  movies: Movie[] = [];

  loading = true;

  constructor(private keyboard: Keyboard) {}

  hideKeyboard() {
    if (!this.loading) {
      this.keyboard.hide();
    }
  }

  ngOnInit() {
    MovieGetWatchedListQuery.getData().subscribe(movies => {
      this.movies = this.movies.concat(movies);

      this.loading = false;
    });
  }
}
