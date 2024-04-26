import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertArray',
})
export class ConvertArrayPipe implements PipeTransform {


  transform(data: string): any {
    return JSON.parse(data);
  }
}
