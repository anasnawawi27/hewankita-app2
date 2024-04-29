import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionsPageRoutingModule } from './transactions-routing.module';

import { TransactionsPage } from './transactions.page';
import { DetailPage } from './detail/detail.page';
import { NgIconsModule } from '@ng-icons/core';
import { lucideChevronLeft, lucideArrowDownWideNarrow, lucideArrowDownNarrowWide, lucideClock4, lucideTimer, lucideAlertCircle, lucideClock, lucideCheckCircle2, lucideCopy, lucidePlus } from '@ng-icons/lucide';
import { saxLocationBulk } from '@ng-icons/iconsax/bulk';
import { saxPetOutline, saxCalendar1Outline } from '@ng-icons/iconsax/outline';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { MaskitoDirective } from '@maskito/angular';
import { StarRatingModule } from 'angular-star-rating';
import { CountQtyPipe } from './count-qty.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    MaskitoDirective,
    CountQtyPipe,
    StarRatingModule.forRoot(),
    TransactionsPageRoutingModule,
    NgIconsModule.withIcons({ 
      lucideArrowDownNarrowWide,
      lucideArrowDownWideNarrow,
      saxCalendar1Outline,
      lucideChevronLeft, 
      saxPetOutline, 
      lucideClock4, 
      lucideTimer, 
      saxLocationBulk, 
      lucideAlertCircle, 
      lucideClock, 
      lucideCheckCircle2, 
      lucideCopy, 
      lucidePlus })
  ],
  declarations: [TransactionsPage, DetailPage]
})
export class TransactionsPageModule {}
