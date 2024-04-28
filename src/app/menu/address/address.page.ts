import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActionSheetController, AlertController, CheckboxChangeEventDetail, CheckboxCustomEvent, ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { FormPage } from './form/form.page';
import * as _ from 'lodash';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class AddressPage implements OnInit {

  private endpoint: string = 'address';
  public loading: boolean = true;
  public rows: any;

  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private toast: ToastService,
    private _apiService: ApiService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getAddress();
  }

  getAddress(){
    this.loading = true;
    lastValueFrom(
      this._apiService.get(this.endpoint, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.rows = res.rows;
      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  onCreate(){
    this.openForm();
  }

  async presentActionSheet(row: any) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih Action',
      mode: 'md',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
              this.onEdit(row)
          },
        },
        {
          text: 'Hapus',
          icon: 'trash',
          handler: () => {
            this.onDelete(row)
          },
        },
        {
          text: 'Batal',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  onChangeCheckbox(event: CheckboxCustomEvent, row: any, index: number){

    const payload = {
      label: row.label,
      address: row.address,
      receiver_name: row.receiver_name,
      receiver_phone: row.receiver_phone,
      main_address: event.detail.checked ? 1 : 0
    }
    this.toast.loading('Mohon Tunggu...')

    lastValueFrom(
      this._apiService.put(this.endpoint + '/' + row.id, payload)
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message);
        this.rows = _.map(this.rows, (d) => {
          d.main_address = 0;
          return d
        })
        this.rows[index].main_address = event.detail.checked ? 1 : 0
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.toast.close('loading')
    })

  }

  async onDelete(row: any){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Alamat akan dihapus',
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
            this.delete(row.id)
          },
        },
      ]
    })

    await confirm.present();
  }

  delete(id: number){
    this.toast.loading('Mohon Tunggu...')

    lastValueFrom(
      this._apiService.delete(this.endpoint + '/' + id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message);
        this.rows = _.filter(this.rows, (d) => d.id !== id)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.toast.close('loading')
    })
  }

  onEdit(row: any){
    this.openForm(row)
  }

  async openForm(props: any = {}){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: FormPage,
      componentProps: { props }
    })

    await modal.present();
    await modal.onDidDismiss().then((o) => {
      if(o.data?.reload){
        this.getAddress()
      }
    })
  }

  loop(length: number){
    return new Array(length)
  }

  back(){
    this.navController.back();
  }

}
