import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { cldConfig } from 'src/config/cloudinary.config';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient, private toastService: ToastService, private imageCompress: NgxImageCompressService) {}

  async upload(image: any, path: string) {
    let formData = new FormData();

    image = await this.imageCompress.compressFile(image, -2 as DOC_ORIENTATION, 70, 50)

    formData.append('file', image);
    formData.append('upload_preset', cldConfig.cloud.uploadPreset);
    formData.append('cloud_name', cldConfig.cloud.cloudName);
    formData.append('folder', path);

    let result = await lastValueFrom(
      this.http.post(
        `https://api.cloudinary.com/v1_1/${cldConfig.cloud.cloudName}/auto/upload`,
        formData
      )
    ).catch((err) => {
      if (err?.error?.message) {
        if (_.isArray(err.error.message)) {
          for (const message of err.error.message) {
            this.toastService.error(message);
          }
        } else {
          this.toastService.error(err.error.message);
        }
      } else {
        this.toastService.error(err.message);
      }
    });
    return result;
  }
}
