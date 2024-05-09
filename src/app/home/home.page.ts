import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import * as _ from 'lodash';
import OneSignal from 'onesignal-cordova-plugin';
import { ToastService } from 'src/services/toast.service';
import { CheckOutPage } from '../check-out/check-out.page';
import { ModalController, NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { SearchPage } from '../search/search.page';
import { FavCountService } from 'src/services/fav-count.service';
import { PusherService } from 'src/services/pusher.service';
import { Device } from '@capacitor/device';
import { LoginPage } from '../auth/login/login.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [ApiService, PusherService],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {

  public loading1: boolean = true;
  public loading2: boolean = true;
  public loading3: boolean = true;
  public loading4: boolean = true;
  public loading5: boolean = true;

  public category: string = 'all';
  public categories: Array<any> = [];
  public banners: Array<any> = [];

  public petsByCategory: Array<any> = [];
  public petsLatestAdd: Array<any> = [];
  public petsCheapest: Array<any> = [];

  public openBanner: boolean = false;
  public banner: any;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  public notifCount: number = 0;

  public deviceId: any;

  constructor(
    private _router: Router,
    private pusherService: PusherService,
    private favService: FavCountService,
    private navController: NavController,
    private modalController: ModalController,
    private _apiService: ApiService,
    private toast: ToastService
  ) {

  }

  ngOnInit(): void {
    this.listenDeviceEvent();
    this.listenNotifications();

    if(localStorage.getItem('notification-count')){
      this.notifCount = parseInt(JSON.parse(localStorage.getItem('notification-count') || '0'))
    }
  }

  listenNotifications(){
    if(Object.keys(this.user).length){
      this.pusherService.channel.bind('notificationsUser-' + (this.user.level == 'admin' ? 'admin' : this.user.id), (d: any) => {
        this.notifCount = d.data;
        localStorage.setItem('notification-count', JSON.stringify(this.notifCount))
        
        if(d.additional){
          const banner = d.additional;
          const exist = _.find(this.banners, (o) => o.id == banner.id);

          if(exist){
            if(banner.display){
              const i = _.findIndex(this.banners, (o) => o.id == exist.id);
              this.banners[i] = banner;
            } else {
              this.banners = _.filter(this.banners, (o) => o.id !== banner.id);
            }
          } else {
            if(banner.display) this.banners.unshift(banner)
          }
        }
      });
    }
  }

  //fungsi untuk listen trigger reload
  async listenDeviceEvent(){
    if(!Object.keys(this.user).length){
      this.deviceId = await Device.getId();

      this.pusherService.channel.bind('event-device-' + this.deviceId.identifier, (d: any) => {
        console.warn('event ' + d.data)
        if(d.data == 'reload'){
          const currentURL = this._router.url.substring(1);
          this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}')
          if(currentURL == 'home'){
            this.initEverything();
          }

          this.listenNotifications();
        } else {
          this.initEverything();
        }
      });

      this.pusherService.channel.bind('update-badge-' + this.deviceId.identifier, (d: any) => {
        if(d.data){
          const data = JSON.parse(d.data);
          this.notifCount = data.notifCount
          localStorage.setItem('notification-count', JSON.stringify(this.notifCount))
        }
      });
    }
  }

  oneSignalInit() {
    if (localStorage.getItem('hewanKitaUserMobile')) {
      let account = JSON.parse(localStorage.getItem('hewanKitaUserMobile') ?? '');
      
      OneSignal.setAppId(environment.oneSignalAppId);
      OneSignal.setExternalUserId('user-' + account.id);

      OneSignal.promptForPushNotificationsWithUserResponse((response) => {
        console.log('Prompt response:', response);
      });
      OneSignal.setNotificationOpenedHandler(function (data: any) {
        let dataAdditional = data.notification.additionalData;
          redirect(dataAdditional['redirect_url']);
      });

      let redirect = (url: string) => {
        this.navController.navigateForward(url, { replaceUrl: true });
      };
    }
  }

  ionViewDidEnter(){
    if(Object.keys(this.user).length){
      this.refresh();
    }
    this.initEverything();
  }

  initEverything(){
    this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}')
    if(Object.keys(this.user).length){
      this.getNotifCount();
    }
    this.getCategories();
    this.getByCategory();
    this.getLatestPet();
    this.getCheapestPet();
    this.getBanners()

    if (Capacitor.isNativePlatform()) {
      this.oneSignalInit();
    }
  }

  onClickCategory(){
    this.getByCategory()
  }

  getBanners(){
    this.loading5 = true;
    lastValueFrom(
      this._apiService.get('banners', {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.banners = res.data;
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading5 = false
    })
  }

  getCategories(){
      lastValueFrom(
        this._apiService.get('categories', {})
      ).then((res) => {
        if(res.statusCode == 200){
          this.categories = res.data;
        }
      }).catch((err) => {
        this.toast.handleError(err)
      }).finally(() => {
        this.loading1 = false
      })
  }

  getByCategory(){
    this.loading2 = true;

    const param = {
      start: 0,
      length: 5,
      category: this.category
    }

    lastValueFrom(
      this._apiService.get('pets', param)
    ).then((res) => {
      if(res.statusCode == 200){
        this.petsByCategory = _.map(res.data, (d) => {
          d['formLoading'] = false;
          return d
        });
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading2 = false
    })
  }

  getLatestPet(){
    this.loading3 = true;

    const param = {
      start: 0,
      length: 5,
      type: 'latest'
    }

    lastValueFrom(
      this._apiService.get('pets', param)
    ).then((res) => {
      if(res.statusCode == 200){
        this.petsLatestAdd = _.map(res.data, (d) => {
          d['formLoading'] = false;
          return d
        });
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading3 = false
    })
  }

  getCheapestPet(){
    this.loading4 = true;

    const param = {
      start: 0,
      length: 5,
      type: 'cheapest'
    }

    lastValueFrom(
      this._apiService.get('pets', param)
    ).then((res) => {
      if(res.statusCode == 200){
        this.petsCheapest = _.map(res.data, (d) => {
          d['formLoading'] = false;
          return d
        });
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading4 = false
    })
  }

  loop(length: number){
    return new Array(length)
  }

  async onFavourite(pet_id: number, index: number, typeParam: string){
    let type = '';
    if(typeParam == 'category'){
      type = this.petsByCategory[index].favourite == null ? 'add' : 'delete';
    }
    if(typeParam == 'latest'){
      type = this.petsLatestAdd[index].favourite == null ? 'add' : 'delete';
    }
    if(typeParam == 'cheapest'){
      type = this.petsCheapest[index].favourite == null ? 'add' : 'delete';
    }

    if(!Object.keys(this.user).length){
      const modal = await this.modalController.create({
        mode: 'ios',
        component: LoginPage,
        componentProps: { isModal: true }
      })
  
      await modal.present();
      await modal.onDidDismiss().then(async (o) => {
        if(o.data?.authenticate){
          this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}')
          this.deviceId = await Device.getId();
          this.addFav(pet_id, index, type, typeParam, this.user.id, this.deviceId.identifier)
        }
      })

      return
    }

    this.addFav(pet_id, index, type, typeParam, this.user.id)

  }

  addFav(pet_id: number, index: number, type: string, typeParam: string, user_id = '', device_id = ''){

    const payload: any = { type, pet_id }
    if(user_id) payload['user_id'] = user_id
    if(device_id) payload['device_id'] = device_id

    lastValueFrom(
      this._apiService.post('favourite', payload)
    ).then((res) => {
      if(res.statusCode == 200){

        if(type == 'add') this.toast.success(res.message);
        if(typeParam == 'category'){
          this.petsByCategory[index].favourite = res.data
        }
        if(typeParam == 'latest'){
          this.petsLatestAdd[index].favourite = res.data
        }
        if(typeParam == 'cheapest'){
          this.petsCheapest[index].favourite = res.data
        }

        this.favService.setFavCount(res.count)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

  async onCheckOut(pet_id: number, i:number, type: string){
    if(!Object.keys(this.user).length){
      const modal = await this.modalController.create({
        mode: 'ios',
        component: LoginPage,
        componentProps: { isModal: true }
      })
  
      await modal.present();
      await modal.onDidDismiss().then(async (o) => {
        if(o.data?.authenticate){
          this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}')
          this.deviceId = await Device.getId();
          this.toast.loading('Mohon Tunggu...')
          this.checkOut(pet_id, i, type, this.deviceId.identifier)
        }
      })
      return
    }

    this.checkOut(pet_id, i, type)

  }

  checkOut(pet_id: number, i:number, type: string, device_id = ''){
    if(this.petsByCategory[i].formLoading) return
    if(type == 'category') this.petsByCategory[i].formLoading = true;
    if(type == 'latest') this.petsLatestAdd[i].formLoading = true;
    if(type == 'cheapest') this.petsCheapest[i].formLoading = true;

    const payload: any = { pet_ids: JSON.stringify([pet_id]) };
    if(device_id){
      payload['device_id'] = device_id
      payload['user_id'] = this.user.id
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
      if(type == 'category') this.petsByCategory[i].formLoading = false;
      if(type == 'latest') this.petsLatestAdd[i].formLoading = false;
      if(type == 'cheapest') this.petsCheapest[i].formLoading = false;

      if(device_id) this.toast.close('loading')
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

  async seeAll(type = ''){
    let categories = []
    if(!['all', 'latest', 'cheapest'].includes(type)){
      categories = _.filter(this.categories, (d) => d.id == type);
    }
    const modal = await this.modalController.create({
      mode: 'ios',
      component: SearchPage,
      componentProps: { modalParams: {
        widthSearchInputClass: 'w-70',
        type: ['all', 'latest', 'cheapest'].includes(type) ? type : null,
        categories
      } }
    })

    await modal.present();
    await modal.onDidDismiss().then((o) => {
      if(o.data?.reloadUser){
        this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
        this.initEverything();
        this.listenNotifications();
      }
    })
  }

  refresh(event: any = null){
    if(Object.keys(this.user).length){
      lastValueFrom(this._apiService.get('auth/refresh',{}))
        .then((res) => {
          if (res.statusCode == 200) {
            localStorage.setItem('hewanKitaUserMobile', JSON.stringify(res.data.account));
          } else {
            this.toast.error(res.message);
          }
        })
        .catch((err) => {
          this.toast.handleError(err);
        })
        .finally(() => {
          if (event) {
            event.target.complete();
          }
        });
    } else {
      if (event) {
        event.target.complete();
      }
    }

    this.getBanners()
  }

  getNotifCount(){
    lastValueFrom(
      this._apiService.get('notification/count-unseen', {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.notifCount = res.data
        localStorage.setItem('notification-count', JSON.stringify(this.notifCount))
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

}
