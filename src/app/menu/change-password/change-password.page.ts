import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class ChangePasswordPage implements OnInit {


  public password: string = '';
  public confirm_password: string = '';

  public formLoading: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  constructor(
    private navController: NavController,
    private _apiService: ApiService,
    private toast: ToastService,
  ) {
    
   }

  ngOnInit() {
  }

  onSubmit(){
    if (
      !this.user.email ||
      !this.password ||
      !this.confirm_password
    ) {
      this.toast.error('Silahkan lengkapi inputan !');
      return;
    }
    const payload = {
      email: this.user.email,
      password: this.password,
    }

    this.formLoading = true;
    lastValueFrom(
      this._apiService.post(
        'auth/change-password',
        payload
      )
    )
      .then(async (res) => {
        if (res.statusCode == 200) {
          this.toast.success(res.message);
          this.navController.back();
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

  back(){
    this.navController.back();
  }

}
