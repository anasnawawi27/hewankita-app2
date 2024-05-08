import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { lastValueFrom } from 'rxjs';
import mask from 'src/app/auth/register/mask';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  providers: [ApiService]
})
export class FormPage implements OnInit {
  readonly maskOptions: MaskitoOptions = mask;
  readonly maskPredicate: MaskitoElementPredicate = (el) => (el as HTMLIonInputElement).getInputElement();

  private endoint: string = 'address';

  public label: string = '';
  public address: string = '';
  public receiver_name: string = '';
  public receiver_phone: string = '';
  public main_address: number = 0;

  public formLoading: boolean = false;
  public formSubmitted: boolean = false;

  public data: any;
  public isEdit: boolean = false;

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  onSave(){
    this.formSubmitted = true;
    if(
      !this.label ||
      !this.address ||
      !this.receiver_name ||
      !this.receiver_phone
    ) return

    this.formLoading = true;
    const payload = {
      label: this.label,
      address: this.address,
      receiver_name: this.receiver_name,
      receiver_phone: this.receiver_phone,
      main_address: this.main_address
    }

    lastValueFrom(
      !this.isEdit ?
      this._apiService.post(this.endoint, payload) :
      this._apiService.put(this.endoint + '/' + this.data?.id, payload)
    ).then((res) => {
      if(res.statusCode == 200 || res.statusCode == 201){
        this.toast.success(res.message);
        this.modalController.dismiss(res.data);
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }

  close(){
    this.modalController.dismiss();
  }

}
