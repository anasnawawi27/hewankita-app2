import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';

import { ShopPage } from './shop.page';
import { FormPage } from './form/form.page';
import { DetailPage } from './detail/detail.page';
import { SwiperModule } from 'swiper/angular';
import { lucidePencil, lucideChevronLeft, lucideChevronDown, lucideSearch, lucideAlertCircle, lucidePlus, lucideCheck } from '@ng-icons/lucide';
import { heroPhotoSolid, heroCameraSolid, heroXMarkSolid, heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { NgIconsModule } from '@ng-icons/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    ImageCropperModule,
    CorePipesModule,
    NgIconsModule.withIcons({ 
      lucideChevronLeft, 
      lucideChevronDown, 
      heroPhotoSolid, 
      heroCameraSolid,
      heroXMarkSolid,
      lucideSearch,
      heroCheckCircleSolid,
      lucideAlertCircle,
      lucidePlus,
      lucideCheck,
      lucidePencil,
      saxTickCircleBulk,
    }),
    ShopPageRoutingModule
  ],
  declarations: [ShopPage, FormPage, DetailPage]
})
export class ShopPageModule {}
