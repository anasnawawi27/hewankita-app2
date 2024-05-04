import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ToastService } from 'src/services/toast.service';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { PusherService } from 'src/services/pusher.service';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PusherService, ApiService]
})
export class DetailPage implements OnInit {

  public message: string = '';
  public formLoading: boolean = false;
  public loading: boolean = true;
  public chats: Array<any> = [];
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  
  @ViewChild('content') private content: any;

  public data: any =  {
    header: {}
  }
  public pet: any = null

  params: any = {}
  isModal: boolean = false;

  private sender_id: string = ''
  private receiver_id: string = ''

  private chatId: string = '';

  constructor(
    private route: ActivatedRoute,
    private pusherService: PusherService,
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController,
    private navController: NavController
  ) {
      this.chatId = this.route.snapshot.params['chatId'];

      if(this.chatId){
        this.getChats({ chat_id: this.chatId })
      }
   }

  ngOnInit() {
    if(Object.keys(this.params).length){

      if(this.params?.header){
        this.data.header = this.params.header
      }

      if(this.params?.pet){
        this.pet = this.params.pet;
      }

      if(this.params?.sender_id){
        this.sender_id = this.params.sender_id;
      }
      
      if(this.params?.receiver_id){
        this.receiver_id = this.params.receiver_id;
      }

      if(this.params?.message){
        this.message = this.params.message;
      }

      this.getChats();
      this.isModal = true;
    }
    this.listenMessages()
    this.listenSeenChat()
  }

  listenMessages(){
    this.pusherService.channel.bind('newChats-' + this.user.id, (chat: any) => {
      this.chats.push(chat.data);
      this.scrollToBottomOnInit()
    });
  }

  listenSeenChat(){
    this.pusherService.channel.bind('seenChats-' + this.user.id, (data: any) => {
      this.chats = _.map(this.chats, (d) => {
        d.seen = true;
        return d
      })
    });
  }

  async getChats(params: any = {}){
    this.loading = true;

    lastValueFrom(this._apiService.get('chat/detail', (Object.keys(params).length ? params : { sender_id: this.sender_id, receiver_id: this.receiver_id })))
    .then(res => {
        if(res.statusCode == 200){

          if(this.chatId){

            const chat = res.data.header;
  
            let header = null;
            this.sender_id= this.user.id
  
            if(chat.sender_id == this.user.id){
              header = {
                profile_image: chat.shop.profile_image,
                name: chat.shop?.shop?.name || chat.shop.fullname,
              }
              this.receiver_id = chat.shop.id
            } else {
              header = {
                profile_image: chat.user.profile_image,
                name: chat.user.fullname,
              }
              this.receiver_id = chat.user.id
            }
  
            this.data.header = header
          }
          this.chats = res.data.messages;
          this.scrollToBottomOnInit()
        }
    } )
    .catch((err) => {
      this.toast.handleError(err)
    }).finally(() =>  {
      this.loading = false
    });
  }

  onSend(){
    if(this.formLoading) return
    if(!this.message) this.toast.warning('Silahkan isi pesan');
    this.formLoading = true;
    const payload: any = {
      sender_id: this.sender_id,
      receiver_id: this.receiver_id,
      message: this.message
    }

    if(this.pet){
      payload['pet_id'] = this.pet.id
    }

    lastValueFrom(this._apiService.post('chat', payload))
    .then((res: any) => {
        
      if(res.statusCode == 201){
        this.toast.success(res.message)
        const newBubble = {
          message: this.message,
          seen: false,
          user_id: this.user.id,
          pet: this.pet,
          created_at: moment().format()
        }
        this.chats.push(newBubble);
        this.pet = null
        this.message = '';
        this.scrollToBottomOnInit()
      }

    })
    .catch((err) => { 
      this.toast.handleError(err) 
    }).finally(() => {
      this.formLoading = false;
    })
  }

  back(){
    if(!this.isModal){
      this.navController.navigateBack('/chats')
    } else {
      this.modalController.dismiss();
    }
  }

  scrollToBottomOnInit() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(400);
      }
    }, 300);
  }

  isIntersecting(isOnScreen: any, data: any) {

    if(isOnScreen && !data.seen && this.user.id !== data.user_id){
      const payload = {
        chat_id: data.chat_id,
        receiver_id: this.receiver_id 
      }
      lastValueFrom(
        this._apiService.put('chat/seen', payload)
      ).then((res: any) => {
        if(res.statusCode == 200){
          console.log('seen chat updated !')
        }
      })
      .catch((err) => { 
        this.toast.handleError(err) 
      })
    }
  }

}
