import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatsPage } from './chats.page';
import { DetailPage } from './detail/detail.page';

const routes: Routes = [
  {
    path: '',
    component: ChatsPage
  },
  {
    path: 'detail/:chatId',
    component: DetailPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsPageRoutingModule {}
