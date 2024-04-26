import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CheckOutPage } from './check-out.page';
import { NgIconsModule } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { saxLocationBulk } from '@ng-icons/iconsax/bulk';
import { heroTrash, heroPlus, heroMinus, heroXMark } from '@ng-icons/heroicons/outline';
import { saxMessageTextOutline } from '@ng-icons/iconsax/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid'
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    NgIconsModule.withIcons({ 
      lucideChevronLeft, 
      lucideChevronRight, 
      saxLocationBulk, 
      heroTrash, 
      heroPlus, 
      heroMinus, 
      heroCheckCircleSolid,
      saxMessageTextOutline, 
      heroXMark }),
  ],
  declarations: [CheckOutPage]
})
export class CheckOutPageModule {}
