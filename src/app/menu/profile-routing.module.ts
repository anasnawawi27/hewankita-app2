import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { FormPage } from './form/form.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'form',
    component: FormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
