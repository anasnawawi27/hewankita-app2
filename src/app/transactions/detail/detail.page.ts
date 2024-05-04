import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { UploadService } from 'src/services/upload.service';
import { Clipboard } from '@capacitor/clipboard';

import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import mask from 'src/app/pet/form/mask';
import * as _ from 'lodash';

import { Camera, CameraResultType, CameraSource, GalleryImageOptions } from '@capacitor/camera';
import { ImageViewPage } from 'src/app/image-view/image-view.page';
import { ClickEvent } from 'angular-star-rating';

@Component({
  selector: 'transaction-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class DetailPage implements OnInit {

  private endpoint: string = 'transaction';
  public id: number;
  public data: any = {};

  public image: string = '';
  public note: string = '';
  public formSubmitted: boolean = false;
  public formLoading: boolean = false;
  public cancelLoading: boolean = false;
  public loading: boolean = true;
  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  public shippingCost: string = '';
  public openModal: boolean = false
  public openModal2: boolean = false

  readonly maskOptions: MaskitoOptions = mask;
  readonly maskPredicate: MaskitoElementPredicate = (el) => (el as HTMLIonInputElement).getInputElement();

  status: any

  public paymentImage: any = {
    file: null,
    cloud: false
  };

  public deliveredImage: any = {
    file: null,
    cloud: false
  };

  public bankLogo: any;
  public bankAccount: any;
  public bankAccountNum: any;
  public bankAccountName: any;

  public cancelType: string = ''
  public cancelMessage: string = ''

  public rating: number = 0;
  public review: string = '';

  public reviewImages: Array<any> = []
  public reviewLoading: boolean = false;

  constructor(
    private toast: ToastService,
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private _uploadService: UploadService,
    private alertController: AlertController,
    private toastController: ToastController,
    private navController: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
  ) { 

    this.id = this.route.snapshot.params['id'];
    if(this.id) this.getDetail()
  }

 async copyToClipboard(bankNum: string){
    await Clipboard.write({
      string: bankNum
    });

    const toast = await this.toastController.create({
      mode: 'md',
      message: 'No Rekening disalin',
      position: 'bottom',
      duration: 3000
    })
    await toast.present();
  };

  ngOnInit() {
    this.status = {
      '1': {
        icon: "'heroClipboardDocumentCheck'",
        label: 'Menunggu Transaksi Diproses Admin',
        className: 'primary'
      },
      '2': {
        icon: "'lucideBan'",
        label: 'Customer Membatalkan Transaksi',
        className: 'danger'
      },
      '3': {
        icon: "'lucideAlertCircle'",
        label: 'Admin Membatalkan Transaksi',
        className: 'danger'
      },
      '4': {
        icon: "'saxEmptyWalletTimeOutline'",
        label: this.user.level == 'user' ? 'Ongkir & Transaksi Sudah Diproses. Lakukan Pembayaran' : 'Menunggu Pembayaran Dari Pembeli',
        className: 'primary'
      },
      '5': {
        icon: "'saxArchiveBookOutline'",
        label: 'Menunggu Verifikasi Pembayaran Oleh Admin',
        className: 'primary'
      },
      '6': {
        icon: "'lucideAlertCircle'",
        label: 'Verifikasi Pembayaran Gagal',
        className: 'danger'
      },
      '7': {
        icon:  this.user.level == 'shop' ? "'saxCardTick1Outline'" : "'saxReceiptEditOutline'",
        label: this.user.level == 'shop' ? 'Yeay!! Ada Pembelian Baru Nih, Segera Proses !' : 'Pembayaran Berhasil. Transaksi Diproses Pemilik Toko',
        className: this.user.level == 'shop' ? 'primary' : 'success'
      },
      '8': {
        icon: "'saxTruckFastOutline'",
        label: 'Pet Dalam Proses Pengiriman',
        className: 'primary'
      },
      '9': {
        icon: "'lucideCheckCircle2'",
        label: 'Pet Sudah Diterima Customer',
        className: 'success'
      },
    }
  }

  getDetail(){
    this.loading = true;
    lastValueFrom(
      this._apiService.get(this.endpoint + '/' + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.updateVarData(res.data)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  updateVarData(data: any){
    this.data = data;
    this.bankLogo = _.find(data.bank, (d) => d.key == 'bank_account_logo').value
    this.bankAccount = _.find(data.bank, (d) => d.key == 'bank_account').value
    this.bankAccountNum = _.find(data.bank, (d) => d.key == 'bank_account_number').value
    this.bankAccountName = _.find(data.bank, (d) => d.key == 'bank_account_name').value

    this.paymentImage = {
      cloud: true,
      file: data.transaction.payment_image
    }

    this.deliveredImage = {
      cloud: true,
      file: data.transaction.delivered_image
    }

    if(data.review){
      this.rating = data.review.rating;
      this.review = data.review.review;

      if(data.review.images){
        this.reviewImages = _.map(JSON.parse(data.review.images), (d) => {
          return { cloud: true, file: d}
        })
      }
    }
  }

  async onSendPet(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Status transaksi akan diupdate',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Lanjutkan',
          role: 'confirm',
          handler: () => {
            this.onProcess('shipping_proceed')
          },
        },
      ]
    })

    await confirm.present();
  }

  async onVerifyPayment(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Verifikasi pembayaran transaksi',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Lanjutkan',
          role: 'confirm',
          handler: () => {
            this.onProcess('verification_payment_success')
          },
        },
      ]
    })

    await confirm.present();
  }

  onProcess(type: any = ''){
    this.formLoading = true;
    const payload = {
      type,
      current_proccess_sort: this.data.transaction.current_process_sort,
      value: Number(this.shippingCost.replace(/[$.]+/g,"")),
    }

    lastValueFrom(
      this._apiService.put(this.endpoint + '/' + this.id, payload )
    ).then((res) => {

      if(res.statusCode == 200){
        this.updateVarData(res.data);
        this.toast.success(res.message);
        localStorage.setItem('reload', 'true');
      }

    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.openModal = false;
      this.formLoading = false
    })
  }

  async onCancel(){
    this.formSubmitted = true;
    if(!this.note) return

    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: this.cancelMessage,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Lanjutkan',
          role: 'confirm',
          handler: () => {
            const payload: any = {
              type: this.cancelType,
              current_proccess_sort: this.data.transaction.current_process_sort,
              note: this.note
            };
            this.cancel(payload)
          },
        },
      ]
    })

    await confirm.present();

  }

  cancel(payload: any){
    this.cancelLoading = true
    lastValueFrom(
      this._apiService.put(this.endpoint + '/' + this.id, payload )
    ).then((res) => {

      if(res.statusCode == 200){
        this.updateVarData(res.data)
        this.toast.success(res.message);
        localStorage.setItem('reload', 'true');
      }

    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.openModal2 = false;
      this.cancelLoading = false
    })
  }

  onShippingProcess(){
    const payload: any = {
      type: 'shipping_proceed'
    }
  }

  onPetReceived(){
    const payload: any = {
      type: 'pet_received'
    }
  }

  loop(length: number){
    return new Array(length)
  }

  back(){
    this.navController.navigateForward('/transactions')
  }

  async presentActionSheet(type: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih File',
      mode: 'md',
      buttons: [
        {
          text: 'Galeri',
          icon: 'images',
          handler: () => {
            if(type == 'review'){
              this.onChooseGalleries()
            } else {
              this.onChoosePhoto(type);
            }
          },
        },
        {
          text: 'Kamera',
          icon: 'camera',
          handler: () => {
            this.onTakePhoto(type);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async onTakePhoto(type: string): Promise<any> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
      });

      if(type == 'payment'){
        this.paymentImage.cloud = false;
        this.paymentImage.file = image.dataUrl as string;
      } else if(type == 'delivery'){
        this.deliveredImage.cloud = false;
        this.deliveredImage.file = image.dataUrl as string;
      } else {
        let result: any = { cloud: false, file: image.dataUrl }
        this.reviewImages.push(result);
      }

    } catch (err) {
      console.log('No Image');
    }
  }

  async onChoosePhoto(type: string): Promise<any> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
      });

      if(type == 'payment'){
        this.paymentImage.cloud = false;
        this.paymentImage.file = image.dataUrl as string;
      } else {
        this.deliveredImage.cloud = false;
        this.deliveredImage.file = image.dataUrl as string;
      }

    } catch (err) {
      console.log('No Image');
    }
  }

  async onChooseGalleries(): Promise<any> {
    try {
      let options: GalleryImageOptions = {
        correctOrientation: true,
      };

      Camera.pickImages(options).then(async (res) => {
        let result: any = [];

        for (const photo of res.photos) {
          const converted =  await this.toDataURL(photo.webPath);
          result.push({ cloud: false, file: converted });
        }
        this.reviewImages = [...this.reviewImages, ...result];
        
      });
    } catch (err) {
      console.log('No Image Pick');
    }
  }

  async toDataURL(url: string): Promise<string> {
    return new Promise(function (resolve, reject) {

      const fileReader = (response: any): Promise<any> => {
        return new Promise(function (resolve, reject) {
          let reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result);
          };
          reader.onerror = (event) => {
            reject(event);
          };
          reader.readAsDataURL(response);
        })
      }

      let xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const res: any = await fileReader(xhr.response)
          resolve(res);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }

  async onUpload(){
    if(!this.paymentImage.file){
      this.toast.warning('Input bukti pembayaran!');
      return
    } 

    this.formLoading = true;
    const payload = {
      value: null,
      current_proccess_sort: this.data.transaction.current_process_sort,
      type: 'payment_prove'
    }

    if(!this.paymentImage.cloud){
      try{
        const upload: any = await this._uploadService.upload(this.paymentImage.file, 'payments');
        if(upload['error']){
          this.toast.error(upload['error']['message']);
          this.formLoading = false;
          return
        }
  
        payload.value = upload['public_id'];
      } catch(e) {
        this.formLoading = false
      }
    }

    lastValueFrom(
      this._apiService.put(this.endpoint + '/' + this.id, payload )
    ).then((res) => {

      if(res.statusCode == 200){
        this.updateVarData(res.data)
        this.toast.success(res.message);
        localStorage.setItem('reload', 'true');
      }

    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }


  async onUploadDelivered(){
    if(!this.deliveredImage.file){
      this.toast.warning('Input bukti pengiriman!');
      return
    } 

    this.formLoading = true;
    const payload = {
      value: null,
      current_proccess_sort: this.data.transaction.current_process_sort,
      type: 'pet_received'
    }

    if(!this.deliveredImage.cloud){
      try{
        const upload: any = await this._uploadService.upload(this.deliveredImage.file, 'delivered');
        if(upload['error']){
          this.toast.error(upload['error']['message']);
          this.formLoading = false;
          return
        }
  
        payload.value = upload['public_id'];
      } catch(e) {
        this.formLoading = false
      }
    }

    lastValueFrom(
      this._apiService.put(this.endpoint + '/' + this.id, payload )
    ).then((res) => {

      if(res.statusCode == 200){
        this.updateVarData(res.data)
        this.toast.success(res.message);
        localStorage.setItem('reload', 'true');
      }

    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }

  async viewImage(photo: any) {
    const modal = await this.modalController.create({
      mode: 'ios',
      component: ImageViewPage,
      showBackdrop: true,
      componentProps: {
        img: photo,
      },
      cssClass: 'transparent-modal',
    });

    modal.present();
  }

  onClickRating(event: ClickEvent){
    this.rating = event.rating
  }

  async onSendReview(){
    this.reviewLoading = true;
    const images = []
    if(this.reviewImages.length){
      for (const image of this.reviewImages) {
        if(!image.cloud){
          try{
            const upload: any = await this._uploadService.upload(image.file, 'reviews');
            if(upload['error']){
              this.toast.error(upload['error']['message']);
              this.reviewLoading = false;
              return
            }
      
            images.push(upload['public_id']);
          } catch(e) {
            this.formLoading = false
          }
        } else {
          images.push(image.file)
        }

      }
    }

    const payload = {
      transaction_id: this.data.transaction.id,
      rating: this.rating,
      review: this.review,
      images: images.length ? JSON.stringify(images) : '',
      pet_ids: JSON.stringify(_.map(this.data.detail, (d) => d.pet_id))
    }

    lastValueFrom(
      this._apiService.post('review', payload)
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.reviewLoading = false
    })

  }
}
