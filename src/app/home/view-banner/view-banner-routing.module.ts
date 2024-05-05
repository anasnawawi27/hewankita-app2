import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBannerPage } from './view-banner.page';

const routes: Routes = [
  {
    path: 'view/:id',
    component: ViewBannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBannerPageRoutingModule {}
