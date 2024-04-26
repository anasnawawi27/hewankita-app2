import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { NgIconsModule } from '@ng-icons/core';
import { lucideShoppingBag, lucideChevronLeft } from '@ng-icons/lucide';
import { heroHome, heroHeart, heroChatBubbleOvalLeftEllipsis, heroShoppingCart } from '@ng-icons/heroicons/outline';
import { TabsPage } from './tabs.page';
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    CorePipesModule,
    NgIconsModule.withIcons({ heroHome, heroHeart, heroChatBubbleOvalLeftEllipsis, heroShoppingCart, lucideShoppingBag, lucideChevronLeft }),
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
