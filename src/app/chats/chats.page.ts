import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ToastService } from 'src/services/toast.service';
import { DetailPage as DetailPageChat }  from 'src/app/chats/detail/detail.page';

import * as _ from 'lodash';

import { ApiService } from 'src/services/api.service';
import { ChatService } from 'src/services/chat.service';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ChatService, ApiService]
})
export class ChatsPage implements OnInit {

  public loading: boolean = true;
  public chats: any = []
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  
  constructor(
    private socket: Socket,
    private toast: ToastService,
    private chatService: ChatService,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getChats();
    this.listenMessages();
    this.listenUnseenChat();
    this.listenUpdateChat();
  }

  listenUpdateChat(){
    this.chatService.getUpdateChat().subscribe((chat: any) => {
      if(Object.keys(chat).length){
        const list = chat.list;
        const index = _.findIndex(this.chats, (d: any) => d.id == list.id );
        if(index < 0){
          this.chats.push(list)
        } else {
          this.chats[index] = list
        }
      }
    })
  }

  listenUnseenChat(){
    this.chatService.getUnseenChat().subscribe((chat: any) => {
      if(Object.keys(chat).length){
        const list = chat.list;
        const index = _.findIndex(this.chats, (d: any) => d.id == list.id );
        if(index < 0){
          this.chats.push(list)
        } else {
          this.chats[index] = list
        }
      }
    })
  }

  async getChats(){
    this.loading = true;
    await fetch(environment.chatUrl + 'chat?user_id=' + this.user.id)
    .then(response => response.json())
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
    this.chatService.getMessages().subscribe((chat: any) => {
      if(Object.keys(chat).length){
        const list = chat.list;
        const index = _.findIndex(this.chats, (d: any) => d.id == list.id );
        if(index < 0){
          this.chats.push(list)
        } else {
          this.chats[index] = list
        }
      }
    })
  }

  async onOpenDetail(chat: any){
    let heading = null;
    const sender_id = this.user.id
    let receiver_id = null;

    if(chat.sender_id == this.user.id){
      heading = {
        profile_image: chat.shop.profile_image,
        name: chat.shop?.shop?.name || chat.shop.fullname,
      }
      receiver_id = chat.shop.id
    } else {
      heading = {
        profile_image: chat.user.profile_image,
        name: chat.user.fullname,
      }
      receiver_id = chat.user.id
    }


    const modal = await this.modalController.create({
      mode: 'ios',
      component: DetailPageChat,
      componentProps: {
        params: { heading, sender_id, receiver_id }
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
