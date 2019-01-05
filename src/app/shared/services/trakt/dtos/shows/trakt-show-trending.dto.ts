import { TraktShowDto } from './trakt-show.dto';

export interface TraktShowTrendingDto {
  watchers: number;
  show: TraktShowDto;
}
