import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { DetailPage as DetailPagePet } from 'src/app/pet/detail/detail.page';
import Swiper, { Navigation, Pagination } from 'swiper';

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
  public data: any;
  public pets: Array<any> = [];
  public show: boolean = true;
  public isInit: boolean = true;
  public loading: boolean = false;
  public loading2: boolean = false;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private route: ActivatedRoute,
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
  }

  ionViewDidEnter(){
    if(!this.isInit){
      if(localStorage.getItem('reload_page')){
        this.getDetail();
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

  getPets(){
    
    this.loading2 = true;
    lastValueFrom(
      this._apiService.get(this.endpoint + '/pets', this.params)
    ).then((res) => {
      if(res.statusCode == 200){
        this.pets = res.data;
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading2 = false
    })
  }

  async onDetail(pet: any){
    this.navController.navigateForward('/pet/detail/' + pet.id)
    // const modal = await this.modalController.create({
    //   mode: 'ios',
    //   component: DetailPagePet,
    //   componentProps: { id: pet.id }
    // })

    // await modal.present();
  }

  addFav(pet_id: number, index: number){
    const type = this.pets[index].favourite == null ? 'add' : 'delete';
    lastValueFrom(
      this._apiService.post('favourite', { type, pet_id })
    ).then((res) => {
      if(res.statusCode == 200){

        if(type == 'add') this.toast.success(res.message);
        this.pets[index].favourite = res.data
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

  async onDelete(id: number){
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
            this.delete(id);
          },
        },
      ]
    })

    await confirm.present();
  }

  delete(id: number){

  }


  back(){
    this.navController.back();
  }

  loop(length: number){
    return new Array(length)
  }


}
