import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StarRatingConfigService } from 'angular-star-rating';
import { lastValueFrom } from 'rxjs';
import { ImageViewPage } from 'src/app/image-view/image-view.page';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService, StarRatingConfigService]
})
export class ReviewPage implements OnInit {

  private endpoint: string = 'review';
  private params: any = {
    start: 0,
    length: 10,
    pet_id: null
  };
  public isInit = true;
  public loading = true;
  public totalData: number = 0;
  public data: Array<any> = [];

  pet_id: number = 0;

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    
    this.params.pet_id = this.pet_id;
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
          this.data = this.isInit
            ? res.data
            : [...this.data, ...res.data];

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
    if (this.data.length === this.totalData) {
      event.target.disabled = true;
      return;
    }
    this.getList(false, null, event);
  }

  dismiss(){
    this.modalController.dismiss()
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

}
