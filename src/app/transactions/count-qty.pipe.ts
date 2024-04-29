import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'countQty',
  standalone: true
})
export class CountQtyPipe implements PipeTransform {

  transform(details: Array<any> = []): number {
    return _.reduce(details, (sum, d) => sum += d.quantity, 0);
  }

}
