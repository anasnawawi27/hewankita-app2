// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class ChatService {
//     public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
//   constructor(private socket: Socket) {}

//   sendMessage(msg: string) {
//     this.socket.emit('message', msg);
//   }
//   getMessage() {
//     return this.socket.fromEvent('receiver-' + this.user.id).pipe(map(data => data));
//   }

//   setSeenChat(data: any) {
//     this.socket.emit('set-seen', data);
//   }

//   getSeenChat() {
//     return this.socket.fromEvent('receive-seen-' + this.user.id).pipe(map(data => data));
//   }
  
//   setUpdateUnseen(data: any) {
//     this.socket.emit('set-update-unseen', data);
//   }

//   setUpdateSelf(data: any) {
//     this.socket.emit('set-update-self', data);
//   }
// }