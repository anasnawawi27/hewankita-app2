import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SwiperModule } from 'swiper/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { CorePipesModule } from 'src/pipes/pipes.module';

import { NgIconsModule } from '@ng-icons/core';
import { saxNotificationOutline } from '@ng-icons/iconsax/outline';
import { lucideSearch, lucideMapPin, lucideShoppingCart, lucideChevronsRight, lucideChevronRight } from '@ng-icons/lucide';
import { ImageViewPage } from '../image-view/image-view.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SwiperModule,
    HomePageRoutingModule,
    CorePipesModule,
    NgIconsModule.withIcons({saxNotificationOutline, lucideSearch, lucideMapPin, lucideShoppingCart, lucideChevronsRight, lucideChevronRight })
  ],
  declarations: [HomePage, ImageViewPage]
})
export class HomPageModule {}
