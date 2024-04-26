import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatsPage } from './chats.page';
import { ChatsPageRoutingModule } from './chats-routing.module';

import { lucideChevronLeft } from '@ng-icons/lucide';
import { NgIconsModule } from '@ng-icons/core';
import { CorePipesModule } from 'src/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    ChatsPageRoutingModule,
    NgIconsModule.withIcons({
      lucideChevronLeft
    })
  ],
  declarations: [ChatsPage]
})
export class ChatsPageModule {}
