import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class MenuPage implements OnInit {

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  
  constructor(
    private toast: ToastService,
    private loadingController: LoadingController,
    private _apiService: ApiService,
    private navController: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  back(){
    this.navController.back();
  }

  ionViewDidEnter() {
    this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  }

  async onLogout(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Anda akan keluar dari aplikasi',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Lanjutkan',
          role: 'confirm',
          handler: () => {
            this.logout();
          },
        },
      ]
    })

    await confirm.present();
  }

  async logout() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Mohon tunggu...',
    });

    await loading.present();

    lastValueFrom(this._apiService.get('auth/logout', {}))
      .then((res) => {
        if (res.statusCode == 200) {

          localStorage.removeItem('isLoginHewanKita');
          localStorage.removeItem('token');
          localStorage.removeItem('hewanKitaUserMobile');

          this.toast.success(res.message);
          this.navController.navigateForward('/auth/login');
        }
      })
      .then((err) => {
        this.toast.handleError(err)
      })
      .finally(() => {
        loading.dismiss();
      });
  }

}
