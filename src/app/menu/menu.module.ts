import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPageRoutingModule } from './menu-routing.module';
import { NgIconsModule } from '@ng-icons/core';
import { heroUser } from '@ng-icons/heroicons/outline';
import { lucideChevronLeft, lucideStore, lucideLogOut } from '@ng-icons/lucide';
import { MenuPage } from './menu.page';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { ProfilePage } from './profile/profile.page';

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
      heroUser 
    }),
    MenuPageRoutingModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
