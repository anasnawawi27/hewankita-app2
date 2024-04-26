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
import { EncryptionService } from 'src/services/encription.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {

  public loading1: boolean = true;
  public loading2: boolean = true;
  public loading3: boolean = true;
  public loading4: boolean = true;

  public category: string = 'all';
  public categories: Array<any> = [];

  public petsByCategory: Array<any> = [];
  public petsLatestAdd: Array<any> = [];
  public petsCheapest: Array<any> = [];

  constructor(
    private _encryptionService: EncryptionService,
    private navController: NavController,
    private modalController: ModalController,
    private _apiService: ApiService,
    private toast: ToastService
  ) {
    
  }

  ngOnInit(): void {

    if (Capacitor.isNativePlatform()) {
      this.oneSignalInit();
    }

    this.getCategories();
    this.getByCategory();
    this.getLatestPet();
    this.getCheapestPet();
  }

  oneSignalInit() {
    if (localStorage.getItem('hewanKitaUserMobile')) {
      let account = JSON.parse(localStorage.getItem('hewanKitaUserMobile') ?? '');

      // OneSignal.initialize(environment.oneSignalAppId);
      // OneSignal.login('user-' + account.auth_id);
      
      // OneSignal.setAppId(environment.oneSignalAppId);
      // OneSignal.setExternalUserId('user-' + account.auth_id);
      // OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      //   console.log('Prompt response:', response);
      // });
      // OneSignal.setNotificationOpenedHandler(function (data: any) {
      //   let dataAdditional = data.notification.additionalData;
      //     // redirect('attendance-list');
      // });

      let redirect = (url: string) => {
        this.navController.navigateForward(url, { replaceUrl: true });
      };

      localStorage.setItem('hewanKitaOneSignalRegistered', 'true');
    }
  }

  ionViewDidEnter(){
    this.refresh();
  }

  onClickCategory(){
    this.getByCategory()
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

  addFav(pet_id: number, index: number, typeParam: string){
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

    lastValueFrom(
      this._apiService.post('favourite', { type, pet_id })
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
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

  checkOut(pet_id: number, i:number, type: string){
    if(this.petsByCategory[i].formLoading) return
    if(type == 'category') this.petsByCategory[i].formLoading = true;
    if(type == 'latest') this.petsLatestAdd[i].formLoading = true;
    if(type == 'cheapest') this.petsCheapest[i].formLoading = true;

    lastValueFrom(
      this._apiService.post('check-out', { pet_ids: JSON.stringify([pet_id]) })
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
  }

  refresh(event: any = null){
    let account = JSON.parse(localStorage.getItem('hewanKitaUserMobile') ?? '{}');
    lastValueFrom(this._apiService.get('auth/refresh',{}))
      .then((res) => {
        if (res.statusCode == 200) {
          // localStorage.setItem(
          //   'token',
          //   JSON.stringify(
          //     this._encryptionService.encryption(res.data.access_token)
          //   )
          // );
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
  }



}
