import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import * as _ from 'lodash';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { HotToastService } from '@ngxpert/hot-toast';
import { CheckOutPage } from '../check-out/check-out.page';
import { FavCountService } from 'src/services/fav-count.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class FavouritesPage implements OnInit {
  private endpoint: string = 'my-favourites'
  public formLoading: boolean = false;
  public loading: boolean = false;

  public data: Array<any> = [];

  constructor(
    private favService: FavCountService,
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    
  }

  ionViewDidEnter(){
    this.getFav() 
  }

  getFav(){
    this.loading = true
    lastValueFrom(
      this._apiService.get(this.endpoint, {})
    ).then((res) => {
      if(res.statusCode == 200){
        const data = [...res.data]
        const shops = _.uniqBy(_.map(data, (d) => d.pet.shop), 'id');
        const favs = _.map(shops, (d) => {
          const petFiltered = _.filter(data, (o) => o.pet.shop.id == d.id);
          const object = {
            shop: d,
            checked_all: false,
            pets: _.map(petFiltered, (val) => {
              val.pet['checked'] = false
              return val.pet
            }),
            selected_pet: 0
          }
          return object
        })

        this.data = [...favs];
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

  async onDelete(id: number){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Pet akan dihapus dari favorit',
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

  async delete(id: number){
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Mohon tunggu',
    })

    await loading.present();

    lastValueFrom(
      this._apiService.post('favourite', { type: "delete", pet_id: id })
    ).then((res) => {
      if(res.statusCode == 200){
        this.favService.setFavCount(res.count)
        this.toast.success('Pet berhasil dihapus!');
        this.getFav();
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      loading.dismiss();
    })

  }

  onCheckedAll(i: number){
    if(this.data[i].checked_all){
      const newPets = _.map(this.data[i].pets, (d) => {
        d.checked = true
        return d
      })
      this.data[i].pets = newPets;
      this.data[i].selected_pet = newPets.length;
    } else {
      this.data[i].pets = _.map(this.data[i].pets, (d) => {
        d.checked = false
        return d
      })
      this.data[i].selected_pet = 0;
    }
  } 

  onChecked(index: number, index2: number){
    if(this.data[index].pets[index2].checked){
      this.data[index].selected_pet += 1;

    } else {
      this.data[index].selected_pet -= 1;
    }
    const checked = _.filter(this.data[index].pets, (d) => d.checked == true)
    this.data[index].checked_all = checked.length == this.data[index].pets.length ?  true : false
  }

  checkOut(){
    let ids: any = [];
    const favs = [...this.data];

    for (const val of favs) {

        const hasChecked = _.some(val.pets, (val) => val.checked == true);
        if(hasChecked){
          const filtered = _.filter(val.pets, (val) => val.checked == true);
          const pet_ids = _.map(filtered, (d) => d.id);
          ids = [...ids, ...pet_ids]
          continue
        }
    } 
    
    this.getCheckOutData(ids)
  }

  getCheckOutData(pet_ids: Array<number>){
    this.formLoading = true;
    lastValueFrom(
      this._apiService.post('check-out', { pet_ids: JSON.stringify(pet_ids) })
    ).then((res) => {
      if(res.statusCode == 200){
        this.showCheckOutModal(res.data)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
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

  back(){
    this.navController.back();
  }

}
