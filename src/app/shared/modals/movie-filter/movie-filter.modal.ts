import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TraktMoviesFilterStructure } from '../../services/trakt/sturctures/movies/trakt-movies-filter.structure';

@Component({
  templateUrl: './movie-filter.modal.html'
})
export class MovieFilterModal {
  filters: TraktMoviesFilterStructure = {
    rating: '',
    genre: '',
    certification: '',
    year: null
  };

  private defaultFilters: TraktMoviesFilterStructure = {
    rating: '',
    genre: '',
    certification: '',
    year: null
  };

  ratings = [
    {
      text: 'All',
      value: ''
    },
    {
      text: '9+',
      value: 9
    },
    {
      text: '8+',
      value: 8
    },
    {
      text: '7+',
      value: 7
    },
    {
      text: '6+',
      value: 6
    },
    {
      text: '5+',
      value: 5
    },
    {
      text: '4+',
      value: 4
    },
    {
      text: '3+',
      value: 3
    },
    {
      text: '2+',
      value: 2
    },
    {
      text: '1+',
      value: 1
    }
  ];

  genres = [
    {
      name: 'All',
      slug: ''
    },
    {
      name: 'Action',
      slug: 'action'
    },
    {
      name: 'Adventure',
      slug: 'adventure'
    },
    {
      name: 'Animation',
      slug: 'animation'
    },
    {
      name: 'Anime',
      slug: 'anime'
    },
    {
      name: 'Comedy',
      slug: 'comedy'
    },
    {
      name: 'Crime',
      slug: 'crime'
    },
    {
      name: 'Disaster',
      slug: 'disaster'
    },
    {
      name: 'Documentary',
      slug: 'documentary'
    },
    {
      name: 'Drama',
      slug: 'drama'
    },
    {
      name: 'Eastern',
      slug: 'eastern'
    },
    {
      name: 'Family',
      slug: 'family'
    },
    {
      name: 'Fan Film',
      slug: 'fan-film'
    },
    {
      name: 'Fantasy',
      slug: 'fantasy'
    },
    {
      name: 'Film Noir',
      slug: 'film-noir'
    },
    {
      name: 'History',
      slug: 'history'
    },
    {
      name: 'Holiday',
      slug: 'holiday'
    },
    {
      name: 'Horror',
      slug: 'horror'
    },
    {
      name: 'Indie',
      slug: 'indie'
    },
    {
      name: 'Music',
      slug: 'music'
    },
    {
      name: 'Musical',
      slug: 'musical'
    },
    {
      name: 'Mystery',
      slug: 'mystery'
    },
    {
      name: 'None',
      slug: 'none'
    },
    {
      name: 'Road',
      slug: 'road'
    },
    {
      name: 'Romance',
      slug: 'romance'
    },
    {
      name: 'Science Fiction',
      slug: 'science-fiction'
    },
    {
      name: 'Short',
      slug: 'short'
    },
    {
      name: 'Sports',
      slug: 'sports'
    },
    {
      name: 'Sporting Event',
      slug: 'sporting-event'
    },
    {
      name: 'Suspense',
      slug: 'suspense'
    },
    {
      name: 'Thriller',
      slug: 'thriller'
    },
    {
      name: 'Tv Movie',
      slug: 'tv-movie'
    },
    {
      name: 'War',
      slug: 'war'
    },
    {
      name: 'Western',
      slug: 'western'
    }
  ];

  certifications = [
    {
      name: 'All',
      slug: ''
    },
    {
      name: 'G',
      slug: 'g',
      description: 'All Ages'
    },
    {
      name: 'PG',
      slug: 'pg',
      description: 'Parental Guidance Suggested'
    },
    {
      name: 'PG-13',
      slug: 'pg-13',
      description: 'Parents Strongly Cautioned - Ages 13+ Recommended'
    },
    {
      name: 'R',
      slug: 'r',
      description: 'Mature Audiences - Ages 17+ Recommended'
    },
    {
      name: 'Not Rated',
      slug: 'nr',
      description: 'Not Rated'
    }
  ];

  constructor(private modalCtrl: ModalController) {}

  private getFilters() {
    const filters = {};

    Object.keys(this.filters).forEach(key => {
      if (this.filters[key] !== '') {
        filters[key] = this.filters[key];
      }
    });

    return filters;
  }

  dismiss() {
    this.modalCtrl.dismiss(this.getFilters());
  }

  apply() {
    this.modalCtrl.dismiss(this.getFilters());
  }

  reset() {
    this.filters = Object.assign({}, this.defaultFilters);
  }
}
