import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatService {
    public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  constructor(private socket: Socket) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  badgeChatTab(){
    return this.socket.fromEvent('badgeChat-User' + this.user.id).pipe(map(data => data));
  }

  getMessages() {
    return this.socket.fromEvent('messagesChat-User' + this.user.id).pipe(map(data => data));
  }

  getSeenChat() {
    return this.socket.fromEvent('updateSeen-User' + this.user.id).pipe(map(data => data));
  }

  getUnseenChat() {
    return this.socket.fromEvent('updateUnseen-User' + this.user.id).pipe(map(data => data));
  }

  getUpdateChat() {
    return this.socket.fromEvent('updateChatSelf-User' + this.user.id).pipe(map(data => data));
  }

  // setSeenChat(data: any) {
  //   this.socket.emit('set-seen', data);
  // }
  
  // setUpdateUnseen(data: any) {
  //   this.socket.emit('set-update-unseen', data);
  // }

  // setUpdateSelf(data: any) {
  //   this.socket.emit('set-update-self', data);
  // }

  // setUpdateBadgeTab(data: any) {
  //   this.socket.emit('set-update-badge', data);
  // }
}
