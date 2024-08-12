import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private socket: Socket
  ) { }

  getNotif(eventName:string) {
    return this.socket.fromEvent(eventName).pipe(map(data => data));
  }
}
