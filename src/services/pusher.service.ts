
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import Pusher from "pusher-js"

@Injectable()
export class PusherService {
    pusher: any;
    channel: any;

    constructor() {
        this.pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster
        });
        this.channel = this.pusher.subscribe('hewanKitaPusherChannels');
    }
    
}

