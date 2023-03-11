import { Pipe, PipeTransform } from '@angular/core';
import * as timeAgo from 'timeago.js';

@Pipe({
  name: 'timeSince'
})
export class TimeSincePipe implements PipeTransform {

  transform(value?: Date, ...args: unknown[]): unknown {
    return timeAgo.format(value ?? new Date());
  }

}
