import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { FormPage } from './form/form.page';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.page.html',
  styleUrls: ['./banners.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class BannersPage implements OnInit {

  private endpoint: string = 'banner';
  public params: any = {
    start: 0,
    length: 10,
    type: 'buy',
    sort: 'desc'
  };

  public isInit = true;
  public loading = true;
  public index: any;
  public totalData: number = 0;
  public rows: Array<any> = [];

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private _apiService: ApiService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.getList();
  }

  ionViewDidEnter() {
    if (localStorage.getItem('reload')) {
      this.getList();
      localStorage.removeItem('reload');
    }
  }

  refreshPage(event: any) {
    this.isInit = true;
    this.getList(true, event);
  }
  
  onSort(){
    this.params.sort == 'desc' ? (this.params.sort = 'asc') : (this.params.sort = 'desc');
    this.params.start = 0;
    this.isInit = true;
    this.getList();
  }

  async getList(refresh = false, refreshEvent: any = null, event?: any) {
    if (this.isInit) {
      this.loading = true;
    }

    if (refresh) {
      this.params.start = 0;
    }

    await lastValueFrom(
      this._apiService.get(this.endpoint, this.params),
    )
      .then((res) => {
        if (res.statusCode === 200) {
          this.totalData = res.totalData;

          this.params.start += res.data.length;
          this.rows = this.isInit
            ? res.data
            : [...this.rows, ...res.data];

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
      })
      .catch((err) => {
        console.log(err)
        this.toast.handleError(err)
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadData(event: any) {
    if (this.rows.length === this.totalData) {
      event.target.disabled = true;
      return;
    }
    this.getList(false, null, event);
  }

  onEdit(row: any, i: number){
    this.index = i;
    const props = {
      id: row.id,
      image: row.image,
      title: row.title,
      description: row.description,
      display: row.display,
    }

    this.showForm(props)
  }

  onCreate(){
    this.showForm()
  }

  async showForm(props = {}){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: FormPage,
      componentProps: { props }
    })

    await modal.present();
    await modal.onDidDismiss().then((o) => {
      if(o.data?.data){
        const data = o.data.data
        this.rows[this.index] = data
      }

      if(o.data?.reload){
        this.isInit = true;
        this.params.start = 0;
        this.getList();
      }
    })
  }

  back(){
    this.navController.back()
  }

}
