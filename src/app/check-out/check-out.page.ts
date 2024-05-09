import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import * as _ from 'lodash';
import { ToastService } from 'src/services/toast.service';
import { FormPage } from '../addresses/form/form.page';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { SelectAdminPage } from './select-admin/select-admin.page';

@Component({
  selector: 'pet-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class CheckOutPage implements OnInit {

  private endpoint: string = 'process-check-out';

  public formLoading: boolean = false;
  public res:any
  public pets: Array<any> = [];
  public selectedAddress: any = null;
  public totalPrice: number = 0
  public serviceFee: number = 0
  public grandTotal: number = 0

  public componentLoading: boolean = false;
  public openModalAddress: boolean = false;
  public addresses: Array<any> = [];

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private alertController: AlertController,
    private _apiService: ApiService,
    private toast: ToastService
  ) {

   }

   ngOnInit() {
    if(this.res){
      this.pets = _.map(this.res.pets, (d) => {
        d['quantity'] = 1;
        d['fix_price'] = 0;
        if(!d.discount_type){
          d['fix_price'] = d.price;
        } else {
          if(d.discount_type == 'percent'){
            d['fix_price'] = d.price - (d.price * (d.discount_percent / 100));
          } else {
            d['fix_price'] = d.price - d.discount_amount
          }
  
        }
        d['total_price'] = d['fix_price'];
        return d
      })
  
      this.countTotalPrice();
      this.selectedAddress = this.res.main_address
    }
  }

  async showFormAddress(){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: FormPage
    })
    await modal.present();
    await modal.onDidDismiss().then((e) => {
      if(e?.data){
        this.selectedAddress = e.data
      }
    })
  }

  showAddressList(){
    this.componentLoading = true;
    this.openModalAddress = true;
    lastValueFrom(
      this._apiService.get('address', {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.addresses = res.rows
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.componentLoading = false
    })
  }

   countTotalPrice(){
    this.totalPrice = _.sumBy(this.pets, 'total_price');
    this.serviceFee = this.totalPrice * (parseInt(this.res.service_fee.replace('%', '')) / 100);
    this.grandTotal = this.totalPrice + this.serviceFee
   }
   
   add(i:number){
    this.pets[i].quantity += 1; 
    this.pets[i].total_price = this.pets[i].quantity * this.pets[i].fix_price;
    this.countTotalPrice()
   }

   minus(i:number){
    if(this.pets[i].quantity == 1){
      this.toast.error('Quantity minimum 1');
      return
    }
    this.pets[i].quantity -= 1; 
    this.pets[i].total_price = this.pets[i].quantity * this.pets[i].fix_price;
    this.countTotalPrice()
   }

   async onRemove(id: number){

    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Pet akan dihapus',
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
            this.pets = _.filter(this.pets, (d) => d.id !== id);
            this.countTotalPrice();
          },
        },
      ]
    })

    await confirm.present();
   }

   showToast(){
    this.toast.error('Pet minimal 1')
   }

   createArray(length: number){
    return new Array(length)
  }

  onProcess(){
    if(!this.selectedAddress?.id){
      this.toast.warning('Alamat masih kosong !');
      return
    }
    this.formLoading = true;

    const shop_id = this.pets[0].shop_id
    const pets = _.map(this.pets, (d) => {
      const object = {
        id: d.id,
        price: d.price,
        fix_price: d.fix_price,
        quantity: d.quantity,
        total_price: d.total_price,
        discount_type: d.discount_type,
        discount_percent: d.discount_percent,
        discount_amount: d.discount_amount,
      }
      return object
    })
    const payload = {
      shop_id,
      pets,
      address_id: this.selectedAddress.id,
      total_price: this.totalPrice,
      service_fee: this.serviceFee,
      fee_percent: this.res.service_fee
    }

    lastValueFrom(
      this._apiService.post(this.endpoint, payload)
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message);
        this.modalController.dismiss();
        this.navController.navigateForward('/transactions/detail/' + res.transaction_id)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }

  async dismiss(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Keluar dari halaman Check Out',
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

  async onChooseAdmin(){

    let message = `Halo Admin. Saya mau tanya biaya kirim untuk Pembelian : \n\n`
    _.forEach(this.pets, (d, i) => {
      message += `${i+1}. ${d.name} ( ${d.quantity} Ekor )\n`
    })

    message += `\nDari Pet Shop : ${ this.res.pets[0].shop.name }, ${ this.res.pets[0].shop.city }\n`; 
    message += `\nDikirim Ke Alamat : `

    if(this.selectedAddress){
      message += this.selectedAddress.address
    }

    const modal = await this.modalController.create({
      mode: 'ios',
      component: SelectAdminPage,
      initialBreakpoint: 0.7,
      breakpoints: [0.5, 0.7, 1],
      componentProps: {
        params: message
      }
    })
    await modal.present();
  }

}
