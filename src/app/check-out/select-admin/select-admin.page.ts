import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { DetailPage } from 'src/app/chats/detail/detail.page';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-select-admin',
  templateUrl: './select-admin.page.html',
  styleUrls: ['./select-admin.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectAdminPage implements OnInit {

  public loading: boolean = true;
  public data: Array<any> = [];
  public endpoint: string = 'admins';

  params: any;

  constructor(
    private modalController: ModalController,
    private _apiService: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    lastValueFrom(this._apiService.get(this.endpoint, {}))
      .then((res) => {
        if (res.statusCode == 200) {
          this.data = res.data;
        } else {
          this.toast.error(res.message);
        }
      })
      .catch((err) => {
        this.toast.handleError(err)
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async onSelectAdmin(admin: any){
    const header = {
      name: admin.fullname,
      profile_image: admin.profile_image
    }

    const user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
    const sender_id = user.id;
    const receiver_id = admin.id;
    const message = this.params;

    const modal = await this.modalController.create({
      mode: 'ios',
      component: DetailPage,
      componentProps: {
        params: { header, sender_id, receiver_id, message }
      }
    })
    await modal.present();

  }

}
