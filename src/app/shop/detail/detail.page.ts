import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { DetailPage as DetailPagePet } from 'src/app/pet/detail/detail.page';
import Swiper, { Navigation, Pagination } from 'swiper';
import { LoginPage } from 'src/app/auth/login/login.page';
import { Device } from '@capacitor/device';
import { CheckOutPage } from 'src/app/check-out/check-out.page';
import { FormPage as FormPetPage } from 'src/app/pet/form/form.page';
import * as _ from 'lodash';
import { FormPage } from '../form/form.page';

Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-shop-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class DetailPage implements OnInit {
  private endpoint: string = 'shop';
  private params: any = {
    start: 0,
    length: 10,
    shop_id: null
  }

  public id: number;
  public totalData: number = 0;
  public data: any;
  public pets: Array<any> = [];
  public show: boolean = true;
  public isInit: boolean = true;
  public loading: boolean = false;
  public loading2: boolean = false;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  isModal: boolean = false;
  shop_id: number = 0;

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private alertController: AlertController,
    private navController: NavController,
  ) {
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.params.shop_id = this.id
      this.getDetail();
      this.getPets();
    } 
   }

  ngOnInit() {
    if(this.shop_id){
      this.id = this.shop_id;
      this.params.shop_id = this.id
      this.getDetail();
      this.getPets();
    }
  }

  ionViewDidEnter(){
    if(!this.isInit){
      if(localStorage.getItem('reload_page')){
        this.getDetail();

        this.loading2 = true;
        this.params.start = 0
        this.getPets();
        localStorage.removeItem('reload_page')
      }
    } 
  }

  getDetail(){
    this.loading = true;
    lastValueFrom(
      this._apiService.get(this.endpoint + '/' + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.data = res.data;
        if(this.isInit) this.isInit = false
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  getPets(refresh = false, refreshEvent: any = null, event?: any){
    if(Object.keys(this.user).length) this.params['user_id'] = this.user.id
    if (this.isInit) {
      this.loading2 = true;
    }

    if (refresh) {
      this.params.start = 0;
    }

    lastValueFrom(
      this._apiService.get(this.endpoint + '/pets', this.params)
    ).then((res) => {
      if(res.statusCode == 200){
        this.totalData = res.totalData;

        const data = _.map(res.data, (d) => {
          d['editLoading'] = false;
          d['deleteLoading'] = false;
          d['formLoading'] = false;
          return d
        })

        this.params.start += res.data.length;
        this.pets = this.isInit
          ? data
          : [...this.pets, ...data];

        if (event) {
          event.target.complete();
        }

        if (this.isInit) {
          this.isInit = false;
        }
        if (refresh) {
          refreshEvent.target.complete();
        }

        
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading2 = false
    })
  }

  async onDetail(pet: any){
    if(!Object.keys(this.user).length){
      const modal = await this.modalController.create({
        mode: 'ios',
        component: LoginPage,
        componentProps: { isModal: true }
      })
  
      await modal.present();
      await modal.onDidDismiss().then(async (o) => {
        if(o.data?.authenticate){
          this.showModalDetailPet(pet)
        }
      })

      return
    }

    if(!this.isModal){
      this.navController.navigateForward('/pet/detail/' + pet.id)
    } else {
      this.showModalDetailPet(pet)
    }

  }

  async showModalDetailPet(pet: any){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: DetailPagePet,
      componentProps: { modalParams: { pet_id: pet.id } }
    })

    await modal.present();
  }

  async onFavourite(pet_id: number, index: number){
    if(!Object.keys(this.user).length){
      const modal = await this.modalController.create({
        mode: 'ios',
        component: LoginPage,
        componentProps: { isModal: true }
      })
  
      await modal.present();
      await modal.onDidDismiss().then(async (o) => {
        if(o.data?.authenticate){
          this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
          const deviceId = await Device.getId();

          this.addFav(pet_id, index, this.user.id, deviceId.identifier);
        }
      })

      return
    }

    this.addFav(pet_id, index, this.user.id);

  }

  addFav(pet_id: number, index: number, user_id = '', device_id = ''){
    this.toast.loading('Mohon Tunggu...');
    
    const type = this.pets[index].favourite == null ? 'add' : 'delete';
    const payload: any = { type, pet_id }

    if(user_id) payload['user_id'] = user_id
    if(device_id) payload['device_id'] = device_id

    lastValueFrom(
      this._apiService.post('favourite', payload)
    ).then((res) => {
      if(res.statusCode == 200){

        if(type == 'add') this.toast.success(res.message);
        this.pets[index].favourite = res.data
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.toast.close('loading')
    })
  }

  async onDelete(id: number, i: number){
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
            this.delete(id, i);
          },
        },
      ]
    })

    await confirm.present();
  }

  async onCheckOut(pet_id: number, i:number,){
    if(!Object.keys(this.user).length){
      const modal = await this.modalController.create({
        mode: 'ios',
        component: LoginPage,
        componentProps: { isModal: true }
      })
  
      await modal.present();
      await modal.onDidDismiss().then(async (o) => {
        if(o.data?.authenticate){
          this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
          const deviceId = await Device.getId();

          this.checkOut(pet_id, i, deviceId.identifier);
        }
      })

      return
    }

    this.checkOut(pet_id, i);

  }

  checkOut(pet_id: number, i: number, device_id = ''){
    if(this.pets[i].formLoading) return
    this.pets[i].formLoading = true;

    const payload: any = { pet_ids: JSON.stringify([pet_id]) }
    payload['user_id'] = this.user.id

    if(device_id){
      payload['device_id'] = device_id 
    }

    lastValueFrom(
      this._apiService.post('check-out', payload)
    ).then((res) => {
      if(res.statusCode == 200){
        this.showCheckOutModal(res.data)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.pets[i].formLoading = false;
    })
  }

  async showCheckOutModal(data:any){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: CheckOutPage,
      componentProps: { res: data }
    })

    await modal.present();
  }

  delete(id: number, i: number){
    this.pets[i].deleteLoading = true;
    lastValueFrom(
      this._apiService.delete('pet/' + id, {})
    ).then((res) => {
        if(res.statusCode == 200){
          this.toast.success(res.message);
          this.isInit = true;
          this.params.start = 0;
          this.getPets()
        }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.pets[i].deleteLoading = false;
    })
  }

  back(){
    if(!this.isModal){
      this.navController.back();
    } else {
      this.modalController.dismiss()
    }

  }

  loop(length: number){
    return new Array(length)
  }

  loadData(event: any) {
    if (this.pets.length === this.totalData) {
      event.target.disabled = true;
      return;
    }
    this.getPets(false, null, event);
  }

  refreshPage(event: any) {
    this.isInit = true;
    this.getPets(true, event);
  }

  async onCreate(){
    if(!this.isModal){
      this.navController.navigateForward('/pet/form/' + this.data?.id)
    } else {
      const modal = await this.modalController.create({
        mode: 'md',
        component: FormPetPage,
        componentProps: { isModal: this.isModal,  shop_id: this.id }
      })
  
      await modal.present();
      await modal.onDidDismiss().then(async (o) => {
        if(o.data?.reload){
          this.isInit = true;

          this.loading = true;
          this.getDetail();

          this.loading2 = true;
          this.params.start = 0
          this.getPets();
        }
      })
    }
  }

  onEdit(shop_id: number, pet: any, i: number){
    if(!this.isModal){
      this.navController.navigateForward('/pet/form/' + shop_id + '/' + pet.id)
    } else {
      this.pets[i].editLoading = true

      lastValueFrom(
        this._apiService.get('pet/' + pet.id, {})
      ).then(async (res) => {
        if(res.statusCode == 200){
          const data = res.data;

          const modal = await this.modalController.create({
            mode: 'ios',
            component: FormPetPage,
            componentProps: { isModal: this.isModal,  shop_id, props: { data } }
          })
      
          await modal.present();
          await modal.onDidDismiss().then(async (o) => {
            if(o.data?.reload){
              this.isInit = true;

              this.loading = true;
              this.getDetail();

              this.loading2 = true;
              this.params.start = 0
              this.getPets();
            }
          })
        }
      }).catch((err) => {
        this.toast.handleError(err)
      }).finally(() => {
        this.pets[i].editLoading = false
      })
    }
  }

  async onEditShop(shop_id: number){
    if(this.isModal){
      const modal = await this.modalController.create({
        mode: 'ios',
        component: FormPage,
        componentProps: { isModal: this.isModal,  shop_id }
      })
  
      await modal.present();
      await modal.onDidDismiss().then(async (o) => {
        if(o.data?.reload){
          this.isInit = true;

          this.loading = true;
          this.getDetail();

          this.loading2 = true;
          this.params.start = 0
          this.getPets();
        }
      })
    } else {
      this.navController.navigateForward('/shop/form/' + shop_id)
    }
  }


}
