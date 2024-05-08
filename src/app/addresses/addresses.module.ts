import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AddressesPageRoutingModule } from './addresses-routing.module';

import { AddressesPage } from './addresses.page';
import { lucideChevronLeft } from '@ng-icons/lucide'
import { heroXMark } from '@ng-icons/heroicons/outline';
import { saxLocationBulk } from '@ng-icons/iconsax/bulk';
import { NgIconsModule } from '@ng-icons/core';
import { FormPage } from './form/form.page';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaskitoDirective,
    AddressesPageRoutingModule,
    NgIconsModule.withIcons({ lucideChevronLeft, heroXMark, saxLocationBulk }),
  ],
  declarations: [AddressesPage, FormPage]
})
export class AddressesPageModule {}
