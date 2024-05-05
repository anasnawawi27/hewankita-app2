import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsPage implements OnInit {
  private endpoint: string = 'notification';
  public params: any = {
    start: 0,
    length: 10
  };
  public isInit = true;
  public loading = true;
  public totalData: number = 0;
  public rows: Array<any> = [];

  constructor(
    private navController: NavController,
    private _apiService: ApiService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.getList();
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

  loop(length: number){
    return new Array(length)
  }

  onOpenNotif(row: any, index: number){
    this.toast.loading('Mohon Tunggu...');

    lastValueFrom(
      this._apiService.put('notification/' + row.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.rows[index].opened = 1;
        this.toast.close('loading');
        this.navController.navigateForward(row.redirect_url)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

  back(){
    this.navController.navigateRoot('/home');
  }

}
