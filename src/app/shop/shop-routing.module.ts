import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopPage } from './shop.page';
import { DetailPage } from './detail/detail.page';
import { FormPage } from './form/form.page';

const routes: Routes = [
  {
    path: '',
    component: ShopPage
  },
  {
    path: 'form',
    component: FormPage
  },
  {
    path: 'form/:id',
    component: FormPage
  },
  {
    path: 'detail/:id',
    component: DetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopPageRoutingModule {}
