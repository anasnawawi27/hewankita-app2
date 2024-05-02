import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EncryptionService } from 'src/services/encription.service';
import { ToastService } from 'src/services/toast.service';
import { lastValueFrom } from 'rxjs';

import * as _ from  'lodash';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {

  private endpoint: string = 'auth/login';
  public email: string = '';
  public password: string = '';
  public showPassword: boolean = false;
  public formLoading: boolean = false;
  public isGuest: boolean = JSON.parse(localStorage.getItem('isGuestHewanKita') || 'false')

  isModal: boolean = false;
  
  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private _apiService: ApiService,
    private _encryptionService: EncryptionService,
    private toast: ToastService
  ) {

   }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.toast.error('Silahkan lengkapi inputan !');
      return;
    }

    this.formLoading = true;
    lastValueFrom(
      this._apiService.post(
        this.endpoint,
        { email: this.email, password: this.password },
        false
      )
    )
      .then((res) => {
        if (res.statusCode == 200) {

          localStorage.setItem(
            'token',
            JSON.stringify(
              this._encryptionService.encryption(res.data.access_token)
            )
          );
          localStorage.setItem('isRegisteredHewanKita', 'true');
          localStorage.setItem('isLoginHewanKita', 'true');
          localStorage.setItem('hewanKitaUserMobile', JSON.stringify(res.data.account));

          this.toast.success(res.message);
          if(!this.isModal){
            this.navController.navigateForward('/home');
          } else {
            this.modalController.dismiss({ reloadUser: true });
          }
          
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

  async onForgotPassword(){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: ForgotPasswordPage
    })

    await modal.present();
  }

  continueAsGuest(){
    localStorage.setItem('isGuestHewanKita', 'true');
    this.navController.navigateForward('/home');
  }

  async onRegister(){
    if(!this.isModal){
      this.navController.navigateForward('/auth/register')
    } else {
      const modal = await this.modalController.create({
        mode: 'ios',
        component: RegisterPage,
        componentProps: { isModal: true }
      })

      await modal.present();
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
