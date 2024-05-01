import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/services/chat.service';
import { ToastService } from 'src/services/toast.service';
import * as _ from 'lodash';
import { FavCountService } from 'src/services/fav-count.service';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  providers: [ChatService]
})
export class TabsPage implements OnDestroy {

  public currentUrl: string = 'home';
  public chats: Array<any> = [];
  public unseenCount: number = 0;
  public favCount: number = 0;
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _apiService: ApiService,
    private favService: FavCountService,
    private chatService: ChatService,
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
    this.getFavCount();
    this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
    if(this.user){
      this.getUnseen();
    }
    this.listenMessages();
  }

  getFavCount(){
    lastValueFrom(this._apiService.get('get-fav-count', {})).then((res) => {
        if(res.statusCode == 200){
            this.favCount = res.data;
            this.favService.setFavCount(res.data);
            this.favService.favCount.pipe(takeUntil(this._unsubscribeAll)).subscribe((res: number) => {
              if (_.isNumber(res)) {
                this.favCount = res
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
    await fetch(environment.chatUrl + 'chat?user_id=' + this.user.id)
    .then(response => response.json())
    .then(res => {
        if(res.statusCode == 200){
          this.chats = res.data;
          this.unseenCount = _.reduce(this.chats, (sum, obj) => sum + obj.unseen, 0);
        }
    } )
    .catch((err) => {
      this.toast.handleError(err)
    })
  }

  listenMessages(){
    this.chatService.getMessage().pipe(takeUntil(this._unsubscribeAll)).subscribe((chat: any) => {
      const list = chat.list;
      const index = _.findIndex(this.chats, (d: any) => d.id == list.id );
      if(index < 0){
        this.chats.push(list)
      } else {
        this.chats[index] = list
      }

      this.unseenCount = _.reduce(this.chats, (sum, obj) => sum + obj.unseen, 0);
    })
  }

}
