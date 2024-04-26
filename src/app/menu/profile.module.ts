import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { lucideChevronLeft } from '@ng-icons/lucide';
import { ProfilePage } from './profile.page';
import { FormPage } from './form/form.page';
import { NgIconsModule } from '@ng-icons/core';
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    NgIconsModule.withIcons({ lucideChevronLeft }),
    ProfilePageRoutingModule,
  ],
  declarations: [ProfilePage, FormPage]
})
export class ProfilePageModule {}
