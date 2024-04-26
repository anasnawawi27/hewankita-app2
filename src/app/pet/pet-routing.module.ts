import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailPage } from './detail/detail.page';
import { FormPage } from './form/form.page';

const routes: Routes = [
  {
    path: 'detail/:id',
    component: DetailPage
  },
  {
    path: 'form/:shopId',
    component: FormPage
  },
  {
    path: 'form/:shopId/:petId',
    component: FormPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetPageRoutingModule {}
