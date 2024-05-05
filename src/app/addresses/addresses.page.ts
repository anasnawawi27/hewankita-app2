import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { FormPage } from './form/form.page';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class AddressesPage implements OnInit {
  private endpoint: string = 'address';

  public rows: Array<any> = [];
  public loading: boolean = true;

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getAddresses()
  }

  getAddresses(){
    this.loading = true
    lastValueFrom(
      this._apiService.get(this.endpoint, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.rows = res.rows
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  async openForm(){
    const modal = await this.modalController.create({
      mode: 'ios',
      component: FormPage,
    })

    await modal.present();
  }

  createArray(length: number){
    return new Array(length)
  }

}
