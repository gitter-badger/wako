import {
  AlertController,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Router } from '@angular/router';
import { Movie } from '../../../shared/entities/movie';
import { Subscription } from 'rxjs';
import { TraktMoviesFilterStructure } from '../../../shared/services/trakt/sturctures/movies/trakt-movies-filter.structure';
import { SearchMoviesQuery } from '../../../shared/queries/movie/search-movies.query';
import { MovieFilterModal } from '../../../shared/modals/movie-filter/movie-filter.modal';
import { ErrorToastService } from '../../../shared/services/app/error-toast.service';

@Component({
  templateUrl: 'movie-search-list.component.html'
})
export class MovieSearchListComponent implements OnInit {
  searching = true;

  movies: Movie[] = [];

  searchInput = '';

  page = 1;

  private lastMoviesRetrievedWithTorrent = [];

  // TODO Add UI filter
  private onlyWithTorrents = false;

  private searcherSubscribers: Subscription[] = [];

  private loader: any;

  private lastPickupGenre = null;

  private imbdIdsPickedUp: string[] = [];

  totalFilter = 0;

  filters: TraktMoviesFilterStructure = {
    rating: '',
    genre: '',
    certification: '',
    year: null
  };

  @ViewChild(IonInfiniteScroll)
  infiniteScroll;

  constructor(
    private keyboard: Keyboard,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private modalCtrl: ModalController,
    private errorToastService: ErrorToastService
  ) {}

  ngOnInit() {
    this.resetSearch();

    this.search();
  }

  displayFilter() {
    this.modalCtrl
      .create({
        component: MovieFilterModal,
        componentProps: { filters: this.filters }
      })
      .then(modal => {
        modal.present();
        modal.onDidDismiss().then(data => {
          this.totalFilter = 0;

          this.filters = data.data;

          Object.keys(this.filters).forEach(key => {
            if (this.filters[key]) {
              this.totalFilter++;
            }
          });
          console.log(this.filters);
          this.resetSearch();
          this.search();
        });
      });
  }

  hideKeyboard() {
    if (!this.searching) {
      this.keyboard.hide();
    }
  }

  private resetSearch() {
    this.page = 1;
    this.movies = [];

    this.searcherSubscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });

    this.searcherSubscribers = [];
  }

  onSearch(event: any) {
    this.resetSearch();

    this.searchInput = event.target.value ? event.target.value : '';

    this.search();
  }

  private search() {
    this.searcherSubscribers.forEach(_subscriber => {
      _subscriber.unsubscribe();
    });

    this.searcherSubscribers = [];

    this.searching = true;

    let _filters = null;
    if (this.filters.certification || this.filters.genre || this.filters.rating || this.filters.year) {
      _filters = this.filters;
    }

    const subscriber = SearchMoviesQuery.getData(this.searchInput, this.page, _filters).subscribe(
      movies => {
        this.movies = this.movies.concat(movies);

        if (this.onlyWithTorrents) {
          this.lastMoviesRetrievedWithTorrent = this.lastMoviesRetrievedWithTorrent.concat(movies);
        }

        this.searching = false;

        if (movies.length === 0) {
          this.infiniteScroll.disabled = true;
        }

        this.infiniteScroll.complete();
      },
      () => {
        this.searching = false;

        this.errorToastService.create('Failed to load my shows');
      }
    );

    this.searcherSubscribers.push(subscriber);
  }

  searchNextPage() {
    this.page++;

    this.search();
  }

  pickRandomMovie() {
    // this.movieService.getAllGenres().subscribe(genres => {
    // TODO
    //         let alert = this.alertCtrl.create();
    //         alert.setTitle('Get a random movie for the genre:');
    //
    //         alert.addInput({
    //           type: 'radio',
    //           label: 'Any',
    //           value: null,
    //           checked: this.lastPickupGenre === null
    //         });
    //
    //         genres.forEach(genre => {
    //           alert.addInput({
    //             type: 'radio',
    //             label: genre.name,
    //             value: genre.slug,
    //             checked: this.lastPickupGenre === genre.slug
    //           });
    //         });
    //
    //
    //         alert.addButton('Cancel');
    //         alert.addButton({
    //           text: 'OK',
    //           handler: selectedGenre => {
    //             console.log('selectedGenre', selectedGenre);
    //             this.lastPickupGenre = selectedGenre.length > 0 ? selectedGenre : null;
    //
    //             this.presentLoading();
    //
    //             let subscriber = fromPromise(this.movieService.pickRandomMovie(this.lastPickupGenre, this.imbdIdsPickedUp))
    //               .pipe(finalize(() => this.loader.dismiss()))
    //               .subscribe(movie => {
    //                 if (!movie) {
    //                   this.toastCtrl.create({
    //                     message: `No movie found for genre: ${selectedGenre}`,
    //                     duration: 3000
    //                   }).then(toast => toast.present());
    //
    //
    //                   return;
    //                 }
    //                 this.imbdIdsPickedUp.push(movie.imdbId);
    // // TODO
    //                 // this.router.navigate(RoutesPath.movieDetail, {
    //                 //   movie: movie
    //                 // });
    //               });
    //
    //             this.loader.onDidDismiss(() => {
    //               subscriber.unsubscribe();
    //             });
    //           }
    //         });
    //         alert.present();
    // });
  }

  presentLoading() {
    // this.loadingCtrl.create({
    //   content: "Please wait...",
    //   showBackdrop: true,
    // })
    //   .then(loader => {
    //     this.loader = loader;
    //     this.loader.present();
    //   });
  }
}
