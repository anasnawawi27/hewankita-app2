import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class FavCountService {
  public onFavCountChanged: BehaviorSubject<any>;
  
  constructor() {
    this.onFavCountChanged = new BehaviorSubject(0);
  }

  public setFavCount(count: number) {
    this.onFavCountChanged.next(count);
  }

  get favCount(): any | Observable<any> {
    return this.onFavCountChanged.asObservable();
  }
}