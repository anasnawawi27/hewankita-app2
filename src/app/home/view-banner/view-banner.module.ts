import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ViewBannerPageRoutingModule } from './view-banner-routing.module';

import { ViewBannerPage } from './view-banner.page';
import { NgIconsModule } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline'
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    NgIconsModule.withIcons({ heroXMark }),
    ViewBannerPageRoutingModule
  ],
  declarations: [ViewBannerPage]
})
export class ViewBannerPageModule {}
