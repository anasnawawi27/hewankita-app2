import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { lastValueFrom } from 'rxjs';
import * as _ from 'lodash';

import {
  Camera,
  CameraResultType,
  CameraSource,
  GalleryImageOptions,
} from '@capacitor/camera';

import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
} from 'ngx-image-cropper';

import { Capacitor } from '@capacitor/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { UploadService } from 'src/services/upload.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shop-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class FormPage implements OnInit {
  private endpoint: string = 'shop';

  public name: string = '';
  public description: string = '';
  public address: string = '';

  public selectedProvince: any = {
    id: null,
    name: null
  };
  public selectedCity: any = {
    id: null,
    province_id: null,
    name: null
  };

  public provinces: Array<any> = [];
  public provincesTemp: Array<any> = [];
  public cities: Array<any> = [];
  public citiesTemp: Array<any> = [];

  public openModalCity: boolean = false;
  public componentLoading: boolean = false;

  public formSubmit: boolean = false;
  public formLoading: boolean = false;
  public images: any[] = [];

  @ViewChild('cropper') cropper!: ImageCropperComponent;
  transform: ImageTransform = {};
  isMobile = Capacitor.getPlatform() !== 'web';
  public image: any = null;
  public isModalOpen: boolean = false;
  public croppedImage: any = null;

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');
  public id: number;
  public loading: boolean = false;
  public isEdit: boolean = false;

  isModal: boolean = false
  shop_id: number = 0

  public edited: boolean = false;

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private _uploadService: UploadService,
    private navController: NavController,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { 
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.isEdit = true;
      this.getDetail();
    } 
  }

  ngOnInit() {
    if(this.shop_id){
      this.id = this.shop_id
      this.isEdit = true;
      this.getDetail();
    } 
  }

  getDetail(){
    this.loading = true;
    lastValueFrom(
      this._apiService.get(this.endpoint + '/' + this.id, {})
    ).then((res) => {
      if(res.statusCode == 200){
        const data = res.data
        this.name = data.name
        this.description = data.description;
        this.address = data.address;
        this.selectedProvince = {
          id: data.province_id,
          name: data.province
        }

        this.selectedCity = {
          id: data.city_id,
          name: data.city
        }

        if(data.galleries){
          this.images = _.map(JSON.parse(data.galleries), (d) => {
            return {
              type: 'edit',
              file: d
            }
          })
        }
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  async onSave(){
    this.formSubmit = true;

    if(
      !this.name || 
      !this.description || 
      !this.address || 
      !this.selectedProvince.id || 
      !this.selectedCity.id) return


    this.formLoading = true;

    const payload: any = {
      name: this.name,
      description: this.description,
      address: this.address,
      city_id: this.selectedCity.id,
      city: this.selectedCity.name,
      province_id: this.selectedProvince.id,
      province: this.selectedProvince.name,
      profile_image: null,
      galleries: null
    }

    if(this.image){
      const upload: any = await this._uploadService.upload(this.image, 'user');
      if(upload['error']){
        this.toast.error(upload['error']['message']);
        this.formLoading = false;
        return
      }
      payload.profile_image = upload['public_id'];
    }

    let imageIds: any = [];
    for (let d of this.images) {
      if(d.type == 'add'){

      try {
        const upload: any = await this._uploadService.upload(d.file, 'shop_galleries');
        if(upload['error']){
          this.toast.error(upload['error']['message']);
          this.formLoading = false;
          return
        }
        imageIds.push(upload['public_id']);
      } catch(e) {
        this.formLoading = false
      }

      } else {
        imageIds.push(d.file)
      }
      
      payload.galleries = JSON.stringify(imageIds);
    }

    lastValueFrom(
      !this.isEdit ?
      this._apiService.post(this.endpoint, payload) :
      this._apiService.put(this.endpoint + '/' + this.id, payload)
    ).then((res) => {
      if(res.statusCode == 201 || res.statusCode == 200){
        this.user = res.data;
        localStorage.setItem('hewanKitaUserMobile', JSON.stringify(res.data));
        this.toast.success(res.message);

        if(this.isModal && res.statusCode == 200) this.edited = true;
      } else {
        this.toast.error(res.message);
      }
    }).catch((err) => {
      this.toast.error(err)
    }).finally(() => {
      this.formLoading = false;
    })

  }

  createArray(length: number){
    return new Array(length)
  }

  async getProvinces(){
    this.componentLoading = true
    await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`)
    .then(response => response.json())
    .then(provinces => {
      this.provinces = [...provinces];
      this.provincesTemp = [...provinces]
    } )
    .catch((err) => {
      this.toast.handleError(err)
    }).finally(() => this.componentLoading = false);
  }

  resetSelectedCity(){
    this.selectedCity = {
      id: null,
      province_id: null,
      name: null
    };
  }

  onSearchProvince(event: any) {
    if (event.target.value) {
      const val = event.target.value.toLowerCase();
      const temp = this.provincesTemp.filter(function (d: any) {
        return (
          d.name.toLowerCase().indexOf(val) !== -1 || !val
        );
      });

      this.provinces = temp;
    } else {
      this.provinces = this.provincesTemp;
    }
  }

  async getCities(){
    this.componentLoading = true
    await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${ this.selectedProvince.id }.json`)
    .then(response => response.json())
    .then(cities => {
      this.cities = [...cities];
      this.citiesTemp = [...cities]
    } )
    .catch((err) => {
      this.toast.handleError(err)
    }).finally(() => this.componentLoading = false);
  }

  onSearchCity(event: any) {
    if (event.target.value) {
      const val = event.target.value.toLowerCase();
      const temp = this.citiesTemp.filter(function (d: any) {
        return (
          d.name.toLowerCase().indexOf(val) !== -1 || !val
        );
      });

      this.cities = temp;
    } else {
      this.cities = this.citiesTemp;
    }
  }

  openModalCities(){
    this.openModalCity = true;
    this.cities = [];
    if(this.selectedProvince.id) this.getCities();
  }

  async onChoosePhoto(): Promise<any> {
    try {
      let options: GalleryImageOptions = {
        correctOrientation: true,
      };

      Camera.pickImages(options).then(async (res: any) => {
        let result: any = [];

        for (const photo of res.photos) {
          const converted =  await this.toDataURL(photo.webPath);
          result.push({ type: 'add', file: converted });
        }
        this.images = [...this.images, ...result];
        
      });
    } catch (err) {
      console.log('No Image Pick');
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
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

  async onChooseGallery(): Promise<any> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
      });

      this.image = image.dataUrl;
      this.croppedImage = null;
      this.isModalOpen = true;
    } catch (err) {
      console.log('No Image');
    }
  }

  async onTakePhoto(): Promise<any> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
      });
      const loading = await this.loadingController.create();
      await loading.present();

      this.image = image.dataUrl;
      this.croppedImage = null;
      this.isModalOpen = true;
    } catch (err) {
      console.log('No Image');
    }
  }

  imageLoaded() {
    this.loadingController.dismiss();
  }

  loadImageFailed() {
    console.log('Image load failed!');
  }

  async cropImage() {
    this.cropper.crop();
  }

  discardChanges() {
    this.image = null;
    this.croppedImage = null;
    this.isModalOpen = false;
  }

  rotate() {
    const newValue = ((this.transform.rotate ?? 0) + 90) % 360;

    this.transform = {
      ...this.transform,
      rotate: newValue,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  async imageCropped(event: ImageCroppedEvent) {
    this.image = await this.toDataURL(event.objectUrl as string);
    this.isModalOpen = false;
  }

  back(){
    if(!this.isModal){
      this.navController.back()
    } else {
      if(this.edited){
        this.modalController.dismiss({ reload: true})
      } else {
        this.modalController.dismiss()
      }
     
    }
      
  }

}
