import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPageRoutingModule } from './menu-routing.module';
import { NgIconsModule } from '@ng-icons/core';
import { heroUser, heroXMark } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';
import { lucideChevronLeft, lucideStore, lucideLogOut, lucideChevronDown, lucideSettings, lucideTags } from '@ng-icons/lucide';
import { MenuPage } from './menu.page';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { ShopPage } from './shop/shop.page';
import { SettingsPage } from './settings/settings.page';
import { CategoriesPage } from './categories/categories.page';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    NgIconsModule.withIcons({ 
      lucideChevronLeft,
      lucideStore,
      lucideLogOut,
      heroUser,
      heroCheckCircleSolid, 
      heroXMarkSolid,
      lucideChevronDown,
      lucideSettings,
      lucideTags,
      heroXMark
    }),
    PickerComponent,
    MenuPageRoutingModule
  ],
  declarations: [MenuPage, ShopPage, SettingsPage, CategoriesPage]
})
export class MenuPageModule {}
