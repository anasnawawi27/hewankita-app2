import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonInput, LoadingController, ModalController, NavController } from '@ionic/angular';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

import * as _ from 'lodash';
import { EncryptionService } from 'src/services/encription.service';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class VerificationPage implements OnInit {

  private endpoint: string = 'auth/verification';
  public disabled: boolean = false;
  public otp: string = '';
  public formLoading: boolean = false;

  @ViewChild('input1') input1!: IonInput;
  @ViewChild('input2') input2!: IonInput;
  @ViewChild('input3') input3!: IonInput;
  @ViewChild('input4') input4!: IonInput;

  public config: CountdownConfig = {
    leftTime: 60,
    format: 'mm:ss'
  };
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  fullname: string = '';
  email: string = '';

  public deviceId: any;

  notFromInit: boolean = false;

  constructor(
    private toast: ToastService,
    private _apiService: ApiService,
    private _encryptionService: EncryptionService,
    private modalController: ModalController,
    private navController: NavController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.getDeviceId();
  }

  async getDeviceId() {
    this.deviceId = await Device.getId();
  }

  ionViewDidEnter() {
    this.input1.setFocus();
    this.countdown.begin();
  }

  close(){
    this.modalController.dismiss();
  }

  submit(){
    const otp = [ this.input1.value, this.input2.value, this.input3.value, this.input4.value ].join('');

    if(!otp || otp.length !== 4){
      this.toast.error('Silahkan isi kode OTP!');
      return
    }

    this.formLoading = true;
    lastValueFrom(
      this._apiService.post(this.endpoint, { verification_code: otp, device_id: this.deviceId.identifier })
    ).then((res) => {
      if(res.statusCode == 200){

        localStorage.setItem('token', JSON.stringify( this._encryptionService.encryption(res.data.access_token)));
        localStorage.setItem('isLoginHewanKita', 'true');
        localStorage.setItem('isRegisteredHewanKita', 'true');
        localStorage.setItem('hewanKitaUserMobile', JSON.stringify(res.data.account));

        this.toast.success(res.message);
        if(this.notFromInit){
          this.modalController.dismiss({ authenticate: true });
        } else {
          this.modalController.dismiss();
        }
        this.navController.navigateForward('/home');

      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false;
    })
  }


  handleEvent(e:any){
    if(e.action == 'done'){
      this.disabled = true
    }
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

  async resend(){
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Mohon Tunggu...'
    })

    await loading.present();

    lastValueFrom(
      this._apiService.post('auth/resend', {
        "fullname": this.fullname,
        "email": this.email
      })
    ).then((res) => {
        if(res.statusCode == 200){
          this.disabled = false;
          this.countdown.restart()
        } 
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      loading.dismiss();
    })

  }

}
