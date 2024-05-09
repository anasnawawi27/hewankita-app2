import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastService } from 'src/services/toast.service';

import * as _ from 'lodash';

import { FavCountService } from 'src/services/fav-count.service';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { PusherService } from 'src/services/pusher.service';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  providers: [ApiService, PusherService]
})
export class TabsPage implements OnDestroy {

  public currentUrl: string = 'home';
  public unseenCount: number = 0;
  public favCount: number = 0;
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  private _unsubscribeAll: Subject<any>;
  public deviceId: any;

  constructor(
    private _apiService: ApiService,
    private pusherService: PusherService,
    private favService: FavCountService,
    private toast: ToastService,
    private router: Router) {
      this._unsubscribeAll = new Subject<void>();
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          if(event.url) this.currentUrl = event.url.replace('/', '');
          this.currentUrl = this.currentUrl || 'home'
        }
      });

    }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(void 0);
    this._unsubscribeAll.complete();
  }

  ionViewDidEnter(){
    if(localStorage.getItem('unseen-message-count')){
      this.unseenCount = parseInt(JSON.parse(localStorage.getItem('unseen-message-count') || '0'))
    }

    if(localStorage.getItem('favourite-count')){
      this.favCount = parseInt(JSON.parse(localStorage.getItem('favourite-count') || '0'))

      console.warn('local storage view enter ' + this.favCount)
    }


    this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
    if(Object.keys(this.user).length){
      this.getUnseen();
      this.getFavCount();
    }
    this.listenMessages();
    this.listenDeviceEvent();
  }

  getFavCount(){

    lastValueFrom(this._apiService.get('get-fav-count', { user_id: this.user.id })).then((res) => {
        if(res.statusCode == 200){
            this.favCount = res.data;
            localStorage.setItem('favourite-count',  JSON.stringify(this.favCount))
            console.warn('function get ' + this.favCount)

            this.favService.setFavCount(res.data);
            this.favService.favCount.pipe(takeUntil(this._unsubscribeAll)).subscribe((res: number) => {
              if (_.isNumber(res)) {
                this.favCount = res
                localStorage.setItem('favourite-count',  JSON.stringify(this.favCount))
                console.warn('service ' + this.favCount)
              }
            });

        } else {
            this.toast.error(res.message)
        }
    }).catch((err) => {
        this.toast.handleError(err)
    })
  }

  async getUnseen(){
    lastValueFrom(this._apiService.get('chat/unseen-count', { user_id: this.user.id})).then((res) => {
      if(res.statusCode == 200){
        this.unseenCount = res.data;
        localStorage.setItem('unseen-message-count',  JSON.stringify(this.unseenCount))
      }
    }).catch((err) => {
        this.toast.handleError(err)
    })
  }

  listenMessages(){
    this.pusherService.channel.bind('updateUnseen-' + this.user.id, (chat: any) => {
      this.unseenCount = chat.data
      localStorage.setItem('unseen-message-count',  JSON.stringify(this.unseenCount))
    });
  }

  async listenDeviceEvent(){
    if(!Object.keys(this.user).length){
      this.deviceId = await Device.getId();

      this.pusherService.channel.bind('update-badge-' + this.deviceId.identifier, (d: any) => {
        if(d.data){
          const data = JSON.parse(d.data);
          this.unseenCount = data.messageCount;
          this.favCount = data.favCount

          console.warn('listener ' + this.favCount)

          localStorage.setItem('unseen-message-count',  JSON.stringify(this.unseenCount))
          localStorage.setItem('favourite-count',  JSON.stringify(this.favCount))
        }
      });
    }
  }

}
