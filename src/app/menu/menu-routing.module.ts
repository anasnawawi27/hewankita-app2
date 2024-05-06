import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
import { ShopPage } from './shop/shop.page';
import { SettingsPage } from './settings/settings.page';
import { CategoriesPage } from './categories/categories.page';
import { DetailPage } from './shop/detail/detail.page';
import { ProfilePage } from './profile/profile.page';
import { AddressPage } from './address/address.page';
import { BannersPage } from './banners/banners.page';
import { FormPage } from './banners/form/form.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { AdminsPage } from './admins/admins.page';
import { DetailPage as DetailAdmins } from './admins/detail/detail.page';

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
  {
    path: 'address',
    component: AddressPage
  },
  {
    path: 'banners',
    component: BannersPage
  },
  {
    path: 'banners/form',
    component: FormPage
  },
  {
    path: 'change-password',
    component: ChangePasswordPage
  },
  {
    path: 'admins',
    component: AdminsPage
  },
  {
    path: 'admins/detail/:id',
    component: DetailAdmins
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
