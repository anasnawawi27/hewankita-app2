import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/services/chat.service';
import { ToastService } from 'src/services/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  providers: [ChatService]
})
export class TabsPage {

  public currentUrl: string = 'home';
  public chats: Array<any> = [];
  public unseenCount: number = 0;
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  constructor(
    private chatService: ChatService,
    private toast: ToastService,
    private router: Router) {

      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          if(event.url) this.currentUrl = event.url.replace('/', '');
          this.currentUrl = this.currentUrl || 'home'
        }
      });
    }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.user = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
    if(this.user){
      this.getUnseen();
    }
    this.listenMessages();
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
    this.chatService.getMessage().subscribe((chat: any) => {
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
