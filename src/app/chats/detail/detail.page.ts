import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ToastService } from 'src/services/toast.service';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { ChatService } from 'src/services/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ChatService, ApiService]
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
    private chatService: ChatService,
    private toast: ToastService,
    private modalController: ModalController,
    private navController: NavController
  ) {
    this.chatId = this.route.snapshot.params['chatId'];

    if(this.chatId){
      this.getChats(`chat/detail?sender_id=${ this.user.id }&chat_id=${ this.chatId }`)
    }
   }

  ngOnInit() {
    if(Object.keys(this.params).length){

      if(this.params?.heading){
        this.data.heading = this.params.heading
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
    this.chatService.getMessages().subscribe((chat: any) => {
      if(Object.keys(chat).length){
        this.chats.push(chat.detail);
        this.scrollToBottomOnInit()
      }
    })
  }

  listenSeenChat(){
    this.chatService.getSeenChat().subscribe((data: any) => {
      if(data?.seen){
        this.chats = _.map(this.chats, (d) => {
          d.seen = true;
          return d
        })
      }
    })
  }

  async getChats(urlParams: string = ''){
    this.loading = true;
    await fetch(environment.chatUrl + (urlParams || `chat/detail?user_id=${ this.user.id }&sender_id=${ this.sender_id }&receiver_id=${ this.receiver_id }`))
    .then(response => response.json())
    .then(res => {
        if(res.statusCode == 200){

          if(this.chatId){

            const chat = res.data.heading;
  
            let heading = null;
            this.sender_id= this.user.id
  
            if(chat.sender_id == this.user.id){
              heading = {
                profile_image: chat.shop.profile_image,
                name: chat.shop?.shop?.name || chat.shop.fullname,
              }
              this.receiver_id = chat.shop.id
            } else {
              heading = {
                profile_image: chat.user.profile_image,
                name: chat.user.fullname,
              }
              this.receiver_id = chat.user.id
            }
  
            this.data.heading = heading
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
      "sender_id": this.sender_id,
      "receiver_id": this.receiver_id,
      "message": this.message
    }

    if(this.pet){
      payload['pet_id'] = this.pet.id
    }

    fetch(environment.chatUrl + 'chat',
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(payload)
    })
    .then((res: any) => res.json())
    .then((res: any) => {
        
      if(res.statusCode == 200){
        // this.chatService.sendMessage(res.data);
        // this.chatService.setUpdateSelf({list: res.data.list_self, receiver: this.sender_id });
        // this.chatService.setUpdateBadgeTab()

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

  isIntersecting(isOnScreen: any, index: number, data: any) {
    if(isOnScreen && !data.seen && this.user.id !== data.user_id){
      const payload = {
        chat_id: data.chat_id,
        receiver_id: this.receiver_id,
        sender_id: this.sender_id,
      }
      fetch(environment.chatUrl + 'chat/seen',
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "PUT",
          body: JSON.stringify(payload)
      })
      .then((res: any) => res.json())
      .then((res: any) => {
        if(res.statusCode == 200){
          console.log('Update chat seen succeed !')
          // this.chatService.setSeenChat({ chat: data.chat_id, receiver: this.receiver_id });
          // this.chatService.setUpdateUnseen({list: res.data.list, receiver: this.user.id });
        }
      })
      .catch((err) => { 
        this.toast.handleError(err) 
      })
    }
  }

}
