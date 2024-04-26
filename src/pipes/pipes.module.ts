import { NgModule } from '@angular/core';
import { CurrencyIDPipe } from './currencyID.pipe';
import { ImgCldPipe } from './imgCld.pipe';
import { InitialsPipe } from './initials.pipe';
import { localDatePipe } from './localDate.pipe';
import { ConvertArrayPipe } from './convertArray.pipe';
import { FirstArrayPipe } from './firstArray.pipe';
@NgModule({
  declarations: [
    ImgCldPipe, InitialsPipe, localDatePipe, CurrencyIDPipe, ConvertArrayPipe, FirstArrayPipe
  ],
  imports: [],
  exports: [
    ImgCldPipe, InitialsPipe, localDatePipe, CurrencyIDPipe, ConvertArrayPipe, FirstArrayPipe
  ],
})
export class CorePipesModule {}
