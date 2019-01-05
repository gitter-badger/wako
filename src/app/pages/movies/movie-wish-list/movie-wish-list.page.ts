import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Movie } from '../../../shared/entities/movie';
import { Subscription } from 'rxjs';
import { MovieGetWishListQuery } from '../../../shared/queries/movie/movie-get-wish-list.query';

@Component({
  templateUrl: 'movie-wish-list.page.html'
})
export class MovieWishListPage implements OnInit {
  searching = true;

  movies: Movie[] = [];

  page = 1;

  private searcherSubscribers: Subscription[] = [];

  constructor(private keyboard: Keyboard) {}

  ngOnInit() {
    this.resetSearch();

    this.search();
  }

  hideKeyboard() {
    if (!this.searching) {
      this.keyboard.hide();
    }
  }

  private resetSearch() {
    this.page = 1;
    this.movies = [];
  }

  private search() {
    this.searcherSubscribers.forEach(_subscriber => {
      _subscriber.unsubscribe();
    });

    this.searcherSubscribers = [];

    this.searching = true;

    const subscriber = MovieGetWishListQuery.getData().subscribe(movies => {
      this.movies = this.movies.concat(movies);

      this.searching = false;
    });

    this.searcherSubscribers.push(subscriber);
  }
}
