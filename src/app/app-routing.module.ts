import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckOutPageModule } from './check-out/check-out.module';
import { AuthGuard } from './auth.guard';
import { SelectAdminPageModule } from './check-out/select-admin/select-admin.module';
import { GuestGuard } from './guest.guard';
import { NotificationsPage } from './notifications/notifications.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'pet',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pet/pet.module').then( m => m.PetPageModule)
  },
  {
    path: 'favourites',
    canActivate: [AuthGuard],
    loadChildren: () => import('./favourites/favourites.module').then( m => m.FavouritesPageModule)
  },
  {
    path: 'transactions',
    canActivate: [AuthGuard, GuestGuard],
    loadChildren: () => import('./transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  {
    path: 'on-boarding',
    loadChildren: () => import('./on-boarding/on-boarding.module').then( m => m.OnBoardingPageModule)
  },
  {
    path: 'chats',
    canActivate: [AuthGuard, GuestGuard],
    loadChildren: () => import('./chats/chats.module').then( m => m.ChatsPageModule)
  },
  {
    path: 'menu',
    canActivate: [AuthGuard, GuestGuard],
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'shop',
    canActivate: [AuthGuard],
    loadChildren: () => import('./shop/shop.module').then( m => m.ShopPageModule)
  },
  {
    path: 'addresses',
    canActivate: [AuthGuard],
    loadChildren: () => import('./addresses/addresses.module').then( m => m.AddressesPageModule)
  },
  {
    path: 'search',
    canActivate: [AuthGuard],
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'notifications',
    component: NotificationsPage
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
