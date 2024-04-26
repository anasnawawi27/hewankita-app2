import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyID',
})
export class CurrencyIDPipe implements PipeTransform {


  transform(value: number): any {

    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });

    return formatter.format(value);
  }
}
