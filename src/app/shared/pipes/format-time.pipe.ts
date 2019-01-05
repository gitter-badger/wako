import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wmFormatTime',
  pure: false
})
export class FormatTimePipe implements PipeTransform {
  constructor() {}

  transform(seconds: number, format: string = '%H:%M:%S') {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds / 60) % 60);
    const sec = seconds % 60;

    return format
      .replace('%h', hours.toString())
      .replace('%H', this.add0(hours).toString())
      .replace('%m', minutes.toString())
      .replace('%M', this.add0(minutes).toString())
      .replace('%s', sec.toString())
      .replace('%S', this.add0(sec).toString());
  }

  private add0(value: number) {
    if (value < 10) {
      return '0' + value;
    }

    return value;
  }
}
