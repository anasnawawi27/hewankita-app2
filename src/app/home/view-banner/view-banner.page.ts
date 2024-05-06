import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-view-banner',
  templateUrl: './view-banner.page.html',
  styleUrls: ['./view-banner.page.scss'],
  providers: [ApiService]
})
export class ViewBannerPage implements OnInit {

  public banner: any;
  public loading: boolean = true;
  public id: string = '';

  constructor(
    private toast: ToastService,
    private _apiService: ApiService,
    private route: ActivatedRoute,
    private navController: NavController
  ) {
    this.id = this.route.snapshot.params['id'];
    this.getDetail();
   }

  ngOnInit() {
  }

  getDetail(){
    lastValueFrom(
      this._apiService.get('banner/' + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.banner = res.data;
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  back(){
    this.navController.navigateBack('/home')
  }

  loop(length: number){
    return new Array(length)
  }

}
