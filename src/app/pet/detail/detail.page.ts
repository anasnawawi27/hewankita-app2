import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

import * as _ from 'lodash';
import Swiper, { Navigation, Pagination } from 'swiper';

import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, NavController } from '@ionic/angular';
import { DetailPage as DetailPageChat }  from 'src/app/chats/detail/detail.page';
import { ImageViewPage } from 'src/app/image-view/image-view.page';
import { ReviewPage } from '../review/review.page';
import { StarRatingConfigService } from 'angular-star-rating';
import { LoginPage } from 'src/app/auth/login/login.page';
import { CheckOutPage } from 'src/app/check-out/check-out.page';
import { Device } from '@capacitor/device';
import { DetailPage as DetailShopPage } from 'src/app/shop/detail/detail.page';

Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'pet-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  providers: [ApiService, StarRatingConfigService],
  encapsulation: ViewEncapsulation.None,
})
export class DetailPage implements OnInit {

  private endpoint: string = 'pets/detail/'
  private id: number;
  
  public formLoading: boolean = false;
  public loading: boolean = true;
  public data: any;

  public swiper!: Swiper;
  public activeIndex: number = 0;

  modalParams: any = {}
  isModal: boolean = false;
  totalSold: number = 0;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  
  public petId: any;
  public lastState: string = '';

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private toast: ToastService,
    public  sanitizer: DomSanitizer
  ) {
    
    this.id = this.route.snapshot.params['id'];
    if(this.id) this.getDetail()

  }

  showVideo(url: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + url.replace('https://youtu.be/', ''))
  }

  ngOnInit() {
    if(Object.keys(this.modalParams).length){
      if(this.modalParams?.pet_id){
        this.isModal = true;
        this.id = this.modalParams.pet_id;
        this.getDetail()
      }
    }
  }

  moveSlide(index: number){
    this.activeIndex = index;
    this.swiper.slideTo(index);
  }

  getDetail(){
    lastValueFrom(
      this._apiService.get(this.endpoint + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.data = res.data;
        this.totalSold = res.totalSold;

        const init = () => {
          const changeIndex = (index: number) => {
            this.activeIndex = index
          }
          this.swiper = new Swiper('.swiper-pet', {
            pagination: {
              el: '.swiper-pagination',
              clickable: true 
            },
            modules: [Navigation, Pagination],
            slidesPerView: 1,
            spaceBetween: 5,
            on: { 
              slideChange: function(e) {
                changeIndex(e.realIndex)
            }}
          }); 
        }
        setTimeout(init, 500)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  loop(length: number){
    return new Array(length)
  }

  async onFavourite(pet_id: number){
    this.petId = pet_id;
    this.lastState = 'favourite';

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

          this.addFav(this.petId, this.user.id, deviceId.identifier);
        }
      })

      return
     }

     this.addFav(this.petId, this.user.id);
  }

  addFav(pet_id: string, user_id = '', device_id = ''){
    this.toast.loading('Mohon Tunggu..')

    const type = this.data.favourite == null ? 'add' : 'delete';
    const payload: any = { type, pet_id }

    if(user_id) payload['user_id'] = user_id
    if(device_id) payload['device_id'] = device_id

    lastValueFrom(
      this._apiService.post('favourite', payload)
    ).then((res) => {
      if(res.statusCode == 200){

        if(type == 'add') this.toast.success(res.message);
        this.data.favourite = res.data
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.toast.close('loading')
    })
  }

  back(){
    if(!this.isModal){
      this.navController.back();
    } else {
      this.modalController.dismiss()
    }
  }

  async onChat(data: any){
    this.lastState = 'chat';

      if(!Object.keys(this.user).length){
        const modal = await this.modalController.create({
          mode: 'ios',
          component: LoginPage,
          componentProps: { isModal: true }
        })
    
        await modal.present();
        await modal.onDidDismiss().then((o) => {
          if(o.data?.authenticate){
            this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
            this.chatShop(data)
          }
        })
        return
      }

    this.chatShop(data)
  }

  async chatShop(data: any){
    const pet = data;
    const header = {
      profile_image: data.shop.user.profile_image,
      name: data.shop.name,
    }
    const sender_id = this.user.id
    const receiver_id = data.shop.user.id

    const modal = await this.modalController.create({
      mode: 'ios',
      component: DetailPageChat,
      componentProps: {
        params: { header, pet, sender_id, receiver_id }
      }
    })
    await modal.present()
  }

  async viewImage(photo: any) {
    const modal = await this.modalController.create({
      mode: 'ios',
      component: ImageViewPage,
      showBackdrop: true,
      componentProps: {
        img: { cloud: true, file: photo},
      },
      cssClass: 'transparent-modal',
    });

    modal.present();
  }

  async seeAll(){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: ReviewPage,
      showBackdrop: true,
      componentProps: { pet_id: this.id}
    });

    modal.present();
  }

  async onCheckOut(){
    
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
          this.checkOut(deviceId.identifier);
        }
      })

      return
    }

    this.checkOut();
  }

  checkOut(device_id = ''){
    this.formLoading = true;

    const payload: any = { pet_ids: JSON.stringify([this.id]) }
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
      this.formLoading = false;
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

  async onViewShop(shop_id: number){
    if(!this.isModal){
      this.navController.navigateForward('/shop/detail/' + shop_id)
    } else {
      const modal = await this.modalController.create({
        mode: 'ios',
        component: DetailShopPage,
        componentProps: { isModal: true, shop_id }
      })
  
      await modal.present();
    }
  }


}
