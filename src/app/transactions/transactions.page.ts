import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class TransactionsPage implements OnInit {
  private endpoint: string = 'transaction';
  public params: any = {
    start: 0,
    length: 10,
    type: 'buy',
    sort: 'desc'
  };
  public isInit = true;
  public loading = true;
  public totalData: number = 0;
  public rows: Array<any> = [];

  status: any = {
    '1': {
      type: 'waiting',
      label: 'Menunggu Transaksi Diproses Admin',
      className: 'primary'
    },
    '2': {
      type: 'danger',
      label: 'Customer Membatalkan Transaksi',
      className: 'danger'
    },
    '3': {
      type: 'danger',
      label: 'Admin Membatalkan Transaksi',
      className: 'danger'
    },
    '4': {
      type: 'success',
      label: 'Ongkir & Transaksi sudah diproses. Lakukan Pembayaran',
      className: 'success'
    },
    '5': {
      type: 'waiting',
      label: 'Menunggu Verifikasi Pembayaran oleh Admin',
      className: 'primary'
    },
    '6': {
      type: 'danger',
      label: 'Verifikasi Pembayaran Gagal',
      className: 'danger'
    },
    '7': {
      type: 'success',
      label: 'Pembayaran Berhasil. Transaksi diproses pemilik toko',
      className: 'success'
    },
    '8': {
      type: 'success',
      label: 'Pet dalam proses Pengiriman',
      className: 'success'
    },
    '9': {
      type: 'success',
      label: 'Pet sudah diterima customer',
      className: 'success'
    },
  }
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  public totalBuy: number = 0
  public totalSold: number = 0
  constructor(
    private _apiService: ApiService,
    private toast: ToastService
  ) {
    if(this.user.level == 'shop') this.params.type = 'sold'
   }

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
          this.totalBuy = res.totalBuy;
          this.totalSold = res.totalSold;

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


}
