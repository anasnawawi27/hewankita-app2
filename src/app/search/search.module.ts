import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { NgIconsModule } from '@ng-icons/core';
import { heroXMarkSolid} from '@ng-icons/heroicons/solid';
import { heroAdjustmentsHorizontal } from '@ng-icons/heroicons/outline';
import { lucideSearch, lucideChevronLeft, lucideListFilter, lucideCheck } from '@ng-icons/lucide';
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    NgIconsModule.withIcons({ 
      heroXMarkSolid, 
      lucideSearch, 
      lucideChevronLeft, 
      lucideListFilter, 
      heroAdjustmentsHorizontal, 
      lucideCheck }),
    SearchPageRoutingModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
