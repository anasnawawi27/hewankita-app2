import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatsPage } from './chats.page';
import { ChatsPageRoutingModule } from './chats-routing.module';
import { lucideSendHorizontal } from '@ng-icons/lucide';
import { heroCheckCircleMini } from '@ng-icons/heroicons/mini'
import { lucideChevronLeft } from '@ng-icons/lucide';
import { NgIconsModule } from '@ng-icons/core';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { SocketIoModule } from 'ngx-socket-io';
import { DetailPage } from './detail/detail.page';
import { OnScreenDirective } from './detail/onscreen.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    SocketIoModule,
    ChatsPageRoutingModule,
    NgIconsModule.withIcons({
      lucideChevronLeft,
      lucideSendHorizontal, 
      heroCheckCircleMini
    })
  ],
  declarations: [ChatsPage, DetailPage, OnScreenDirective]
})
export class ChatsPageModule {}
