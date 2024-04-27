import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
import { ShopPage } from './shop/shop.page';
import { SettingsPage } from './settings/settings.page';
import { CategoriesPage } from './categories/categories.page';
import { DetailPage } from './shop/detail/detail.page';
import { ProfilePage } from './profile/profile.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage
  },
  {
    path: 'profile',
    component: ProfilePage
  },
  {
    path: 'shops',
    component: ShopPage
  },
  {
    path: 'shops/detail/:id',
    component: DetailPage
  },
  {
    path: 'settings',
    component: SettingsPage
  },
  {
    path: 'categories',
    component: CategoriesPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
