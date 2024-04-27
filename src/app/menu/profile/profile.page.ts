import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ImageViewPage } from 'src/app/image-view/image-view.page';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { UploadService } from 'src/services/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilePage implements OnInit {

  private endpoint: string = 'profile'
  public loading: boolean = false;
  public data: any;
  public image: any = {
    cloud: false,
    file: null
  };
  public openForm: boolean = false;

  public input = {
    fullname: '',
    email: '',
    phone_number: '',
    profile_image: ''
  }

  public formLoading: boolean = false;
  public formSubmitted: boolean = false;

  constructor(
    private _uploadService: UploadService,
    private _apiService: ApiService,
    private toast: ToastService,
    private modalController: ModalController,
    private navController: NavController
  ) {

   }

  ngOnInit() {
    this.getProfile();
  }

  getProfile(){
    this.loading = true;
    lastValueFrom(
      this._apiService.get(this.endpoint, {})
    ).then((res) => {
      if(res.statusCode == 200){
        this.data = res.data;
      } else {
        this.toast.error(res.message)
      }
    }
    ).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  async onChooseGallery(): Promise<any> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
      });

      this.image.cloud = false;
      this.image.file = image.dataUrl;
    } catch (err) {
      console.log('No Image');
    }
  }

  async viewImage(photo: any) {
    const modal = await this.modalController.create({
      mode: 'ios',
      component: ImageViewPage,
      showBackdrop: true,
      componentProps: {
        img: { cloud: true, file: photo},
      },
      cssClass: 'transparent-modal',
    });

    modal.present();
  }

  showForm(){
    this.input.fullname = this.data.fullname
    this.input.email = this.data.email
    this.input.phone_number = this.data.phone_number

    this.image.cloud = this.data.profile_image ? true : false
    this.image.file = this.data.profile_image;

    this.openForm = true
  }

  async onEditAccount(){
    this.formSubmitted = true;
    if(
      !this.input.fullname ||
      !this.input.email ||
      !this.input.phone_number
    ) return

    this.formLoading = true;

    if(!this.image.cloud && this.image.file){
      try{
        const upload: any = await this._uploadService.upload(this.image.file, 'pets');
        if(upload['error']){
          this.toast.error(upload['error']['message']);
          this.formLoading = false;
          return
        }
  
        this.input.profile_image = upload['public_id'];
      } catch(e) {
        this.formLoading = false;
        return
      }
    }

    lastValueFrom(
      this._apiService.put(this.endpoint, this.input)
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message)
        this.data.fullname = this.input.fullname
        this.data.email = this.input.email
        this.data.phone_number = this.input.phone_number
        this.data.profile_image = this.input.profile_image

        this.openForm = false
      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }

  back(){
    this.navController.back()
  }

}
