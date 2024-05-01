import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { ApiService } from 'src/services/api.service';
import * as _ from 'lodash';
import { ToastService } from 'src/services/toast.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class ForgotPasswordPage implements OnInit {

  public email: string = '';
  public password: string = '';
  public confirm_password: string = '';
  public code: string = '';
  public disabled: boolean = false;
  public formLoading: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  @ViewChild('input1') input1!: IonInput;
  @ViewChild('input2') input2!: IonInput;
  @ViewChild('input3') input3!: IonInput;
  @ViewChild('input4') input4!: IonInput;

  public config: CountdownConfig = {
    leftTime: 60,
    format: 'mm:ss'
  };
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  public state : 'email' | 'verification' | 'password' = 'email';
  public verification_code: string = '';

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private _apiService: ApiService,
    private toast: ToastService,
  ) {
    
   }

  ngOnInit() {
  }


  onVerification(){
    const verification = [ this.input1.value, this.input2.value, this.input3.value, this.input4.value ].join('');

    if(!verification || verification.length !== 4){
      this.toast.error('Silahkan Isi Kode Verifikasi!');
      return
    }

    if(this.verification_code !== verification){
      this.toast.error('Kode Verifikasi Yang Anda Input Tidak Valid!');
      return
    }

    this.toast.success('Verifikasi Kode Berhasil !')
    this.state = 'password'
  }

  onSendEmail(){
    if(!this.email){
      this.toast.error('Input Email Terlebih Dahulu!');
      return
    }

    if(this.state == 'email'){
      this.formLoading = true;
    } else {
      this.toast.loading('Mohon Tunggu');
    } 

    lastValueFrom(
      this._apiService.get('auth/verif-code-password', { email: this.email })
    ).then((res) => {
      if(res.statusCode == 200){
        
        if(this.state == 'verification'){
          this.disabled = false;
          this.countdown.restart()
        }

        if(this.state == 'email') this.state = 'verification';
        setTimeout(() => {
          this.input1.setFocus();
          this.countdown.begin();
        }, 500)
        
        this.verification_code = res.verification_code
      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
        this.formLoading = false;
        if(this.state == 'verification') this.toast.close('loading')
    })
    
  }

  onKeyUp(e: any, nth: number, input: any){
    if(input.value.length > 1){
      input.value = input.value.substring(1, 2)
    }
    if(!_.isNaN(Number(e.key))){
      if(nth == 1) this.input2.setFocus();
      if(nth == 2) this.input3.setFocus();
      if(nth == 3) this.input4.setFocus();
    } else if(e.key == 'Backspace'){
      if(nth == 4){
        if(!this.input4.value){
          this.input3.setFocus()
        }
      } 

      if(nth == 3){
        if(!this.input3.value){
          this.input2.setFocus()
        }
      } 

      if(nth == 2){
        if(!this.input2.value){
          this.input1.setFocus()
        }
      } 
    }
  }

  handleEvent(e:any){
    if(e.action == 'done'){
      this.disabled = true
    }
  }

  resend(){
    this.onSendEmail();
  }

  onSubmit(){
    if (
      !this.email ||
      !this.password ||
      !this.confirm_password
    ) {
      this.toast.error('Silahkan lengkapi inputan !');
      return;
    }
    const payload = {
      email: this.email,
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
          this.modalController.dismiss();
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

  async back(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Keluar Dari Halaman Ini',
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
            this.modalController.dismiss();
          },
        },
      ]
    })

    await confirm.present();
  }
}
