import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstArray',
})
export class FirstArrayPipe implements PipeTransform {


  transform(data: string): any {
    const array = JSON.parse(data)
    return array[0];
  }
}
