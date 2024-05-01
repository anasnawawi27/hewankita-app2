import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import * as _ from 'lodash';
import { CheckOutPage } from '../check-out/check-out.page';
import { DetailPage } from '../pet/detail/detail.page';
import { LoginPage } from '../auth/login/login.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class SearchPage implements OnInit {
  private endpoint: string = 'search';

  public openFilter: boolean = false;
  public keyword: string = '';
  public showResult: boolean = false;
  public loading: boolean = false;
  
  public params = {
    start: 0,
    length: 10,
    type: '',
    categories: '[]',
    keyword: ''
  }
  public type: string = '';
  public data: Array<any> = [];
  public categories: Array<any> = [];
  public categoryIds: Array<any> = [];
  public categoryOptions: Array<any> = [];
  public filterOptions: Array<any> = [
    {label: 'Harga Paling Murah', value: 'cheapest'},
    {label: 'Baru Ditambahkan', value: 'latest'},
    {label: 'Dengan Diskon', value: 'with_discount'}
  ];
  public keywordHistories: Array<any> = JSON.parse(localStorage.getItem('lastSearchKeywords') || '[]');
  public latestSeen: Array<any> = JSON.parse(localStorage.getItem('lastSeenPets') || '[]');
  public filtering: boolean = false;
  public isInit: boolean = true;
  public totalData: number = 0;

  public isModal: boolean = false;
  modalParams: any = {};
  widthSearchInputClass: string = '';
  @ViewChild('inputSearch') inputSearch!: IonInput ;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController,
    private navController: NavController
  ) {
    this.getCategories()
   }   

  ngOnInit() {
    setTimeout(() => {
      this.inputSearch.setFocus();
    },200);

    if(Object.keys(this.modalParams).length){
      this.isModal = true;
      if(this.modalParams.type !== 'all') this.type = this.modalParams.type;
      if(this.modalParams.categories.length){
        this.categories = this.modalParams.categories;
        this.categoryIds = _.map(this.modalParams.categories, (d) => d.id);
      } 

      if(this.modalParams.type !== 'all' || this.modalParams.categories.length){
        this.filtering = true
      }
      
      this.widthSearchInputClass = this.modalParams.widthSearchInputClass
      this.onSearch();
    }
    
  }

  ionViewDidEnter(){
    this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}')
  }

  refreshPage(event: any) {
    this.isInit = true;
    this.getData(true, event);
  }

  getCategories(){
    lastValueFrom(
      this._apiService.get('categories', {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.categoryOptions = res.data;
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

  onSelectCategory(data: any){
    if(this.categoryIds.includes(data.id)){
      this.categories = _.filter(this.categories, (d) => d.id !== data.id); 
      this.categoryIds = _.filter(this.categoryIds, (id) => id !== data.id); 
    } else {
      this.categories.push(data); 
      this.categoryIds.push(data.id)
    }
  }

  addFav(pet_id: number, index: number){
    if(!this.isModal){
      if(!Object.keys(this.user).length){
        this.navController.navigateForward('auth/login');
        return
      }
    } else {
      this.showModalLogin();
      return
    }

    const type = this.data[index].favourite == null ? 'add' : 'delete';
    lastValueFrom(
      this._apiService.post('favourite', { type, pet_id })
    ).then((res) => {
      if(res.statusCode == 200){

        if(type == 'add') this.toast.success(res.message);
        this.data[index].favourite = res.data
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

  checkOut(pet_id: number, i:number, type: string){
    if(!this.isModal){
      if(!Object.keys(this.user).length){
        this.navController.navigateForward('auth/login');
        return
      }
    } else {
      this.showModalLogin();
      return
    }

    if(this.data[i].formLoading) return
    this.data[i].formLoading = true;

    lastValueFrom(
      this._apiService.post('check-out', { pet_ids: JSON.stringify([pet_id]) })
    ).then((res) => {
      if(res.statusCode == 200){
        this.showCheckOutModal(res.data)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.data[i].formLoading = false;
    })

  }

  loop(length: number){
    return new Array(length)
  }

  onSearch(){
    this.setHistorySearch(); 
    this.showResult = true;
    this.isInit = true;
    this.params.start = 0;
    this.getData()
  }

  loadData(event: any) {
    if (this.data.length == this.totalData) {
      event.target.disabled = true;
    }
    this.getData(false, null, event);
  }

  getData(refresher = false, refresherEvent: any = null, event?: any){

    this.params.type = this.type;
    this.params.keyword = this.keyword;
    this.params.categories = JSON.stringify(this.categoryIds)

    if (this.isInit) {
      this.loading = true;
    }

    if (refresher) {
      this.params.start = 0;
    }
    const params = {...this.params}

    lastValueFrom(
      this._apiService.get(this.endpoint, params)
    ).then((res) => {
      if(res.statusCode == 200){
        const data = _.map(res.data, (d) => {
          d['formLoading'] = false;
          return d
        })

        this.totalData = res.totalData;
        this.params.start += res.data.length;
        this.data = this.isInit ? data : [...this.data, ...res.data];
        if (event) {
          event.target.complete();
        }

        this.loading = false;

        if (this.isInit) {
          this.isInit = false;
        }

        if (refresher) {
          refresherEvent.target.complete();
        }
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  clearHistory(){
    localStorage.removeItem('lastSearchKeywords')
    this.keywordHistories = []
  }

  async showCheckOutModal(data:any){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: CheckOutPage,
      componentProps: { res: data }
    })

    await modal.present();
  }

  setHistorySearch(){

    if(this.keyword){
      if(!localStorage.getItem('lastSearchKeywords')){
  
        const last = [this.keyword]
        localStorage.setItem('lastSearchKeywords', JSON.stringify(last));
  
      } else {
        const histories = JSON.parse(localStorage.getItem('lastSearchKeywords') || '[]');
        
        if(histories.length > 5) histories.pop();
  
        histories.unshift(this.keyword);
        localStorage.setItem('lastSearchKeywords', JSON.stringify(_.uniq(histories)));
      }
      this.keywordHistories = JSON.parse(localStorage.getItem('lastSearchKeywords') || '[]')
    }
    
  }

  async onViewdetail(pet: any){
    this.setLastSeen(pet)

    if(!this.isModal){
      this.navController.navigateForward('/pet/detail/' + pet.id)
    } else {
        const modal = await this.modalController.create({
          mode: 'ios',
          component: DetailPage,
          componentProps: { modalParams: {
            pet_id: pet.id
          } }
        })
    
        await modal.present();
    }
  }

  setLastSeen(pet: any){

    if(!localStorage.getItem('lastSeenPets')){

      const last = [pet]
      localStorage.setItem('lastSeenPets', JSON.stringify(last));

    } else {
      const lastSeen = JSON.parse(localStorage.getItem('lastSeenPets') || '[]');
      
      if(lastSeen.length > 4) lastSeen.pop();

      lastSeen.unshift(pet);
      localStorage.setItem('lastSeenPets', JSON.stringify(_.uniqBy(lastSeen, 'id')));
    }
    
    this.latestSeen = JSON.parse(localStorage.getItem('lastSeenPets') || '[]')
  }

  back(){
    if(!this.isModal){
      this.navController.back()
    } else {
      this.modalController.dismiss()
    }
  }

  async showModalLogin(){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: LoginPage,
      componentProps: { isModal: true }
    })

    await modal.present();
  }

}
