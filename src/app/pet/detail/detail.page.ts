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
  public videUrl: string = 'https://www.youtube.com/embed/3u3EHJuf4Mg?si=tAcC0LcBM0aln8t5'
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
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  ngOnInit() {
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
    setTimeout(init, 300)
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
        this.totalSold = res.totalSold
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

  addFav(pet_id: number){
    const type = this.data.favourite == null ? 'add' : 'delete';
    lastValueFrom(
      this._apiService.post('favourite', { type, pet_id })
    ).then((res) => {
      if(res.statusCode == 200){

        if(type == 'add') this.toast.success(res.message);
        this.data.favourite = res.data
      }
    }).catch((err) => {
      this.toast.handleError(err)
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
    const pet = data;
    const heading = {
      profile_image: data.shop.user.profile_image,
      name: data.shop.name,
    }
    const sender_id = this.user.id
    const receiver_id = data.shop.user.id

    const modal = await this.modalController.create({
      mode: 'ios',
      component: DetailPageChat,
      componentProps: {
        params: { heading, pet, sender_id, receiver_id }
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
    });

    modal.present();
  }


}
