import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ToastService } from 'src/services/toast.service';
import { DetailPage as DetailPageChat }  from 'src/app/chats/detail/detail.page';

import * as _ from 'lodash';

import { PusherService } from 'src/services/pusher.service';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PusherService, ApiService]
})
export class ChatsPage implements OnInit {

  public loading: boolean = true;
  public chats: any = []
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  
  constructor(
    private pusherService: PusherService,
    private toast: ToastService,
    private _apiService: ApiService,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getChats();
    this.listenMessages()
  }

  async getChats(){
    this.loading = true;
    lastValueFrom(this._apiService.get('chat', {}))
    .then(res => {
        if(res.statusCode == 200){
          this.chats = res.data
        }
    } )
    .catch((err) => {
      this.toast.handleError(err)
    }).finally(() =>  {
      this.loading = false
    });
  }

  listenMessages(){
    this.pusherService.channel.bind('chatListUpdate-' + this.user.id, (chat: any) => {

      const list = JSON.parse(chat.data);
      const index = _.findIndex(this.chats, (d: any) => d.id == list.id );

      if(index < 0){
        this.chats.push(list)
      } else {
        this.chats[index] = list
      }

    });
  }

  async onOpenDetail(chat: any){
    let header = null;
    const sender_id = this.user.id
    let receiver_id = null;

    if(chat.sender_id == this.user.id){
      header = {
        profile_image: chat.shop.profile_image,
        name: chat.shop?.shop?.name || chat.shop.fullname,
      }
      receiver_id = chat.shop.id
    } else {
      header = {
        profile_image: chat.user.profile_image,
        name: chat.user.fullname,
      }
      receiver_id = chat.user.id
    }


    const modal = await this.modalController.create({
      mode: 'ios',
      component: DetailPageChat,
      componentProps: {
        params: { header, sender_id, receiver_id }
      }
    })
    await modal.present()
  }

  loop(length: number){
    return new Array(length)
  }

  back(){
    this.navController.navigateBack('/home')
  }

}
