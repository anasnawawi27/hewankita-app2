import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ImageViewPage } from 'src/app/image-view/image-view.page';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { UploadService } from 'src/services/upload.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  providers: [ApiService]
})
export class FormPage implements OnInit {

  private endpoint: string = 'banner'
  private id: string = ''

  public isEdit: boolean = false;
  public formLoading: boolean = false;
  public formSubmitted: boolean = false;

  public input = {
    title: '',
    description: '',
    image: '',
    display: true
  }

  public image: any= {
    cloud: false,
    file: null
  }

  props: any = {}
  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private _uploadService: UploadService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if(Object.keys(this.props).length){
      this.isEdit = true;

      this.id = this.props.id;
      this.input.title = this.props.title
      this.input.description = this.props.description
      this.input.display = this.props.display ? true : false;

      if(this.props.image){
        this.input.image = this.props.image;

        this.image.file = this.props.image;
        this.image.cloud = true;
      }
    }
  }

  async onSave(){
    this.formSubmitted = true;
    if(
      !this.image.file ||
      !this.input.title ||
      !this.input.description
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
  
        this.input.image = upload['public_id'];
      } catch(e) {
        this.formLoading = false;
        return
      }
    }

    lastValueFrom(
      !this.isEdit 
      ? this._apiService.post(this.endpoint, this.input)
      : this._apiService.put(this.endpoint + '/' + this.id, this.input)
    ).then((res) => {
      if(res.statusCode == 200 || res.statusCode == 201){
        this.toast.success(res.message);
        if(!this.isEdit){
          this.modalController.dismiss({ reload: true })
        } else {
          this.modalController.dismiss({ data: res.data })
        }
      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }

  close(){
    this.modalController.dismiss()
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
        img: photo,
      },
      cssClass: 'transparent-modal',
    });

    modal.present();
  }

}
