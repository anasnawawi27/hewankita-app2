import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Camera, GalleryImageOptions } from '@capacitor/camera';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import mask from './mask';
import * as _ from 'lodash';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UploadService } from 'src/services/upload.service';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class FormPage implements OnInit {

  readonly maskOptions: MaskitoOptions = mask;
  readonly maskPredicate: MaskitoElementPredicate = (el) => (el as HTMLIonInputElement).getInputElement();
  private endpoint: string = 'pet';

  public name: string = '';
  public description: string = '';
  public description_url: string = '';
  public gender: string = 'male';
  public age: string = '';
  public ageType: string = 'Tahun';
  public weight: string = '';
  public price: string = '';
  public withDiscount: boolean = false;
  public discountPercent: string = '';
  public discountAmount: string = '';
  public stock: number = 0;
  public images: Array<any> = [];
  public display: number = 1;
  public tags: Array<any> = [];

  public componentLoading: boolean = false;
  public formSubmitted: boolean = false;
  public formLoading: boolean = false;
  public categories: Array<any> = [];
  public selectedCategory: any = {
    id: null,
    name: null
  }
  
  public shopId: number;
  public petId: number;
  public discountType: string = 'percent';
  public isEdit: boolean = false;
  public loading: boolean = false;

  constructor(
    private _apiService: ApiService,
    private _uploadService: UploadService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private navController: NavController
  ) {

    this.shopId = this.route.snapshot.params['shopId'];
    this.petId = this.route.snapshot.params['petId'];
    if(this.petId){
      this.isEdit = true;
      this.getDetail();
    } 
   }

  ngOnInit() {
  }

  getDetail(){
    this.loading = true;
    lastValueFrom(
      this._apiService.get(this.endpoint + '/' + this.petId, {})
    ).then((res) => {
      if(res.statusCode == 200){
        const data = res.data
        this.name = data.name
        this.description = data.description;
        this.description_url = data.description_url;
        this.gender = data.gender;

        const age = data.age.split(' ');
        this.age = age[0];
        this.ageType = age[1];
        this.weight = data.weight;

        this.selectedCategory = {
          id: data.category_id,
          name: data.category?.name
        }
        this.images = _.map(JSON.parse(data.images), (d) => {
          return { type: 'edit', file: d }
        })

        if(data.discount_type){
          this.withDiscount = true;
          this.discountType = data.discount_type;
          this.discountPercent = data.discount_percent
          this.discountAmount = data.discount_amount
        }

        this.price = data.price.toString();
        this.stock = data.stock
        this.tags = _.map(data.tags.split(', '), (d) => {
          return {
            display: d,
            value: d
          }
        });
        this.display = data.display;
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  async onSave(){

    this.formSubmitted = true;
    if(
      !this.name ||
      !this.description ||
      !this.age ||
      !this.selectedCategory.id ||
      !this.images.length ||
      !this.price ||
      !this.stock
    ) return

    if(this.withDiscount){
      if(this.discountType == 'percent' && !this.discountPercent) return
      if(this.discountType == 'amount' && !this.discountAmount) return
    }

    this.formLoading = true;

    const tags = _.map(this.tags, (d) => d.value);
    const payload: any = {
      name: this.name,
      description: this.description,
      description_url: this.description_url,
      gender: this.gender,
      age: this.age + ' ' + this.ageType,
      weight: this.weight,
      category_id: this.selectedCategory.id,
      images: null,
      price:  Number(this.price.replace(/[$.]+/g,"")),
      discount_type: this.withDiscount ? this.discountType : null,
      discount_percent: this.withDiscount && this.discountType == 'percent' ? this.discountPercent : null,
      discount_amount: this.withDiscount && this.discountType == 'amount' ?  Number(this.discountAmount.replace(/[$.]+/g,"")) : null,
      tags: tags.join(', '),
      stock: this.stock,
      display: this.display,
      shop_id: this.shopId,
    }

    let imageIds: any = [];
    for (let d of this.images) {
      if(d.type == 'add'){

        try{
          const upload: any = await this._uploadService.upload(d.file, 'pets');
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
      
      payload.images = JSON.stringify(imageIds);
    }

    lastValueFrom(
      !this.isEdit ?
      this._apiService.post(this.endpoint, payload) :
      this._apiService.put(this.endpoint + '/' + this.petId, payload)
    ).then((res) => {
      if(res.statusCode == 200 || res.statusCode == 201){
        this.toast.success(res.message);
        localStorage.setItem('reload_page', 'TRUE')
        this.back();
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })

  }

  async onChoosePhoto(): Promise<any> {
    try {
      let options: GalleryImageOptions = {
        correctOrientation: true,
      };

      Camera.pickImages(options).then(async (res) => {
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

  async getCategories(){
    this.componentLoading = true;
    this.categories = await this._apiService.getComponents('categories')
    this.componentLoading = false;
  } 

  createArray(length: number){
    return new Array(length)
  }

  back(){
    
    this.navController.navigateBack('/shop/detail/' + this.shopId)
  }

}
