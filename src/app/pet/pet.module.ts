import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PetPageRoutingModule } from './pet-routing.module';
import { DetailPage } from './detail/detail.page';
import { SwiperModule } from 'swiper/angular';
import { lucideChevronLeft, lucidePlus, lucideChevronDown , lucideChevronsRight} from '@ng-icons/lucide';
import { saxTickCircleBulk } from '@ng-icons/iconsax/bulk'
import { saxMessageBold } from '@ng-icons/iconsax/bold'
import { heroXMarkSolid, heroCheckCircleSolid } from '@ng-icons/heroicons/solid'
import { NgIconsModule } from '@ng-icons/core';
import { FormPage } from './form/form.page';
import { MaskitoDirective } from '@maskito/angular';
import { TagInputModule } from 'ngx-chips';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { StarRatingModule } from 'angular-star-rating';
import { ReviewPage } from './review/review.page';

@NgModule({
  imports: [
    TagInputModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PetPageRoutingModule,
    SwiperModule,
    MaskitoDirective,
    CorePipesModule,
    StarRatingModule.forRoot(),
    NgIconsModule.withIcons({ 
      lucideChevronsRight,
      lucideChevronLeft, 
      lucideChevronDown,
      saxTickCircleBulk, 
      saxMessageBold, 
      lucidePlus,
      heroXMarkSolid,
      heroCheckCircleSolid
   })
  ],
  declarations: [FormPage, DetailPage, ReviewPage]
})
export class PetPageModule {}
