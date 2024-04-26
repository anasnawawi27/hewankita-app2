import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'localizedDate',
})
export class localDatePipe implements PipeTransform {
  transform(value: any, format: string) {
    return moment(value).tz('Asia/Jakarta').locale('id-ID').format(format);
  }
}
