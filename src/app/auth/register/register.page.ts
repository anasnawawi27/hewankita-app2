import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { lastValueFrom } from 'rxjs';

import * as _ from 'lodash';
import { VerificationPage } from '../verification/verification.page';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
 
import mask from './mask';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class RegisterPage implements OnInit {

    private endpoint: string = 'auth/register';

    public fullname: string = '';
    public phone_number: string = '';
    public email: string = '';
    public password: string = '';
    public confirm_password: string = '';

    public showPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    public formLoading: boolean = false;

    isModal: boolean = false;

    readonly maskOptions: MaskitoOptions = mask;
    readonly maskPredicate: MaskitoElementPredicate = (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private toast: ToastService,
    private _apiService: ApiService,
    private _modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (
      !this.fullname ||
      !this.email ||
      !this.password ||
      !this.confirm_password
    ) {
      this.toast.error('Silahkan lengkapi inputan !');
      return;
    }
    const payload = { 
      fullname: this.fullname, 
      phone_number: this.phone_number,
      email: this.email,
      password: this.password,
      confirm_password: this.confirm_password,
      level: 'user'
    }

    this.formLoading = true;
    lastValueFrom(
      this._apiService.post(
        this.endpoint,
        payload
      )
    )
      .then(async (res) => {
        if (res.statusCode == 200) {
          this.toast.success(res.message);
          const modal = await this._modalController.create({
            mode: 'ios',
            component: VerificationPage,
            componentProps: {
              fullname: payload.fullname,
              email: payload.email
            }
          })
          await modal.present();
        } else {
          this.toast.error(res.message);
        }
      })
      .catch((err) => {
        this.toast.handleError(err);
      })
      .finally(() => {
        this.formLoading = false;
      });
  }

  async onLogin(){
    if(!this.isModal){
      this.navController.navigateForward('/auth/login')
    } else {
      this.modalController.dismiss()
    }
  }

  back(){
    if(!this.isModal){
      this.navController.back()
    } else {
      this.modalController.dismiss();
    }
  }

}
