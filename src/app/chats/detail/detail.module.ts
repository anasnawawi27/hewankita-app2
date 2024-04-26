import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';
import { DetailPage } from './detail.page';
import { NgIconsModule } from '@ng-icons/core';
import { lucideChevronLeft, lucideSendHorizontal } from '@ng-icons/lucide';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { SocketIoModule } from 'ngx-socket-io';
import { OnScreenDirective } from './onscreen.directive';
import { heroCheckCircleMini } from '@ng-icons/heroicons/mini'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    NgIconsModule.withIcons({
      lucideChevronLeft, lucideSendHorizontal, heroCheckCircleMini
    }),
    DetailPageRoutingModule,
    SocketIoModule
  ],
  declarations: [DetailPage, OnScreenDirective]
})
export class DetailPageModule {}
