import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ImageViewPage } from 'src/app/image-view/image-view.page';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { FormPage } from '../form/form.page';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class DetailPage implements OnInit {


  private endpoint: string = 'admin';

  public id: number = 0;
  public data: any;
  public formLoading: boolean = false;
  public loading: boolean = false;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  public deleteLoading: boolean = false;

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

  back(){
    this.navController.back();
  }

  async onDelete(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Admin akan dihapus',
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
            this.delete()
          },
        },
      ]
    })

    await confirm.present();
  }

  delete(){
    this.toast.loading('Mohon Tunggu...')
    this.deleteLoading = true;
    lastValueFrom(
      this._apiService.delete(this.endpoint + '/' + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message);
        localStorage.setItem('reload', 'TRUE');
        this.back();
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.toast.close('loading')
    })
  }

  async onEdit(){

    const modal = await this.modalController.create({
      mode: 'ios',
      component: FormPage,
      componentProps: { props: this.data }
    })

    await modal.present();
    await modal.onDidDismiss().then((o) => {
      if(o.data?.data){
        this.data = o.data.data;
        localStorage.setItem('reload', 'TRUE');
      }
    })
  }

}
