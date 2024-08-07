import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ImageViewPage } from 'src/app/image-view/image-view.page';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-detail-shop',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class DetailPage implements OnInit {

  private endpoint: string = 'shop';

  public id: number = 0;
  public data: any;
  public formLoading: boolean = false;
  public loading: boolean = false;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private navController: NavController,
    private _apiService: ApiService,
    private toast: ToastService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.getDetail();
    } 
  }

  getDetail(){
    this.loading = true;
    lastValueFrom(
      this._apiService.get(this.endpoint + '/' + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.data = res.data;
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
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

  async onVerification(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Pet Shop akan diverifikasi',
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
            this.verification()
          },
        },
      ]
    })

    await confirm.present();
  }

  verification(){
    this.formLoading = true;
    lastValueFrom(
      this._apiService.put(this.endpoint + '/verification/' + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message)
        this.data.is_verified = true;
      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }

  back(){
    this.navController.back();
  }

}
