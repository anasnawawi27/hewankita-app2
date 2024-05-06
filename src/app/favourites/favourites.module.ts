import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FavouritesPage } from './favourites.page';
import { NgIconsModule } from '@ng-icons/core';
import { lucideChevronLeft, lucideTrash2, lucideChevronRight } from '@ng-icons/lucide';
import { heroTrash, heroPlus, heroMinus, heroXMark } from '@ng-icons/heroicons/outline';
import { saxTickCircleBulk, saxLocationBulk } from '@ng-icons/iconsax/bulk';
import { saxVerifyBold } from '@ng-icons/iconsax/bold';
import { FavouritesPageRoutingModule } from './favourites-routing.module';
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    NgIconsModule.withIcons({ saxVerifyBold, lucideChevronLeft, saxTickCircleBulk, heroTrash, lucideTrash2, heroPlus, heroMinus, heroXMark, saxLocationBulk, lucideChevronRight }),
    FavouritesPageRoutingModule
  ],
  declarations: [FavouritesPage]
})
export class FavouritesPageModule {}
