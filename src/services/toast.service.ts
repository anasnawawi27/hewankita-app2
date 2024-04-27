import { Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import * as _ from 'lodash';

@Injectable()
export class ToastService {
  public style = {
    padding: '16px',
    color: 'white',
    width: '100vw',
    borderRadius: '20px',
    fontWeight: '600',
    opacity: '0.5',
    backgroundColor: '#303030'
  }

  constructor(
    private toast: HotToastService
  ) {
    // this.toast.show('Hello World!');
    // this.toast.loading('Lazyyy...');
    // this.toast.success('Yeah!!');
    // this.toast.warning('Boo!');
    // this.toast.error('Oh no!');
    // this.toast.info('Something...');
  }

  success(message: string, style: any = {}, duration: number = 0) {
    if(!duration) duration = 3000
    if(!Object.keys(style).length) style = this.style

     this.toast.success(message, { duration, style });
  }

  error(message: string, style: any = {}, duration: number = 0) {
    if(!duration) duration = 3000
    if(!Object.keys(style).length) style = this.style

     this.toast.error(message, { duration, style });
  }

  warning(message: string, style: any = {}, duration: number = 0) {
    if(!duration) duration = 3000
    if(!Object.keys(style).length) style = this.style

     this.toast.warning(message, { duration, style });
  }

  loading(message: string, style: any = {}) {
    if(!Object.keys(style).length) style = this.style

     this.toast.loading(message, {id: 'loading', style });
  }

  close(id: string){
    this.toast.close(id)
  }

  handleError(err: any){
      if (err?.error?.message) {
        if (_.isArray(err.error.message)) {
          for (const message of err.error.message) {
            this.toast.error(message);
          }
        } else {
          if(_.isString(err.error.message)){
            this.toast.error(err.error.message);
          } else {
            if(Object.keys(err.error.message).length){
              for (const key in err.error.message) {
                this.toast.error(err.error.message[key].join(', '));
              }
            }
          }
        }
      } else {
        this.toast.error(err.message);
      }
  }
}
