import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  providers: [ApiService]
})
export class FormPage implements OnInit {
  private endoint: string = 'address';

  public label: string = '';
  public address: string = '';
  public receiver_name: string = '';
  public receiver_phone: string = '';
  public main_address: number = 0;

  public formLoading: boolean = false;
  public formSubmitted: boolean = false;

  public id: number = 0;
  public data: any;
  public isEdit: boolean = false;
  props: any

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if(Object.keys(this.props).length){
      this.isEdit = true;
      this.id = this.props.id;
      this.label = this.props.label
      this.address = this.props.address
      this.receiver_name = this.props.receiver_name
      this.receiver_phone = this.props.receiver_phone
      this.main_address = this.props.main_address

    }
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
      this._apiService.put(this.endoint + '/' + this.id, payload)
    ).then((res) => {
      if(res.statusCode == 200 || res.statusCode == 201){
        this.toast.success(res.message);
        this.modalController.dismiss({ reload: true});
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
