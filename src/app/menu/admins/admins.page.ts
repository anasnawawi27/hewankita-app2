import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { FormPage } from './form/form.page';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.page.html',
  styleUrls: ['./admins.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class AdminsPage implements OnInit {

  private endpoint: string = 'admin';
  public params: any = {
    start: 0,
    length: 10,
    type: 'all'
  };
  public isInit = true;
  public loading = true;
  public totalData: number = 0;
  public totalActive: number = 0;
  public totalNonactive: number = 0;
  public rows: Array<any> = [];

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getList();
  }

  ionViewDidEnter() {
    if (localStorage.getItem('reload')) {
      this.isInit = true;
      this.params.start = 0;
      this.getList();
      localStorage.removeItem('reload');
    }
  }

  refreshPage(event: any) {
    this.isInit = true;
    this.getList(true, event);
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
          this.totalActive = res.totalActive;
          this.totalNonactive = res.totalNonactive;
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

  back(){
    this.navController.back();
  }

  onCreate(){
    this.openForm()
  }

  async openForm(props: any = {}){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: FormPage,
      componentProps: { props }
    })

    await modal.present();
    await modal.onDidDismiss().then((o) => {
      if(o.data?.reload){
        this.isInit = true;
        this.params.start = 0
        this.getList();
      }
    })
  }

}
