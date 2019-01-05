import { Component, Input } from '@angular/core';
import { Show } from '../../../../../shared/entities/show';

@Component({
  selector: 'wk-show-list',
  templateUrl: 'show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent {
  @Input()
  loading;

  @Input()
  shows: Show[] = [];
}
