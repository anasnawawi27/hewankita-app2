import { Pipe, PipeTransform } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { cldConfig } from '../config/cloudinary.config';
import { fill } from '@cloudinary/url-gen/actions/resize';

@Pipe({
  name: 'imgCld',
})
export class ImgCldPipe implements PipeTransform {
  cld = new Cloudinary(cldConfig);

  transform(imageID: string, width: number = 0, height: number = 0): any {
    const img = this.cld.image(imageID);
    if (width && height) {
      img.resize(fill().width(width).height(height));
    }
    return img.toURL();
  }
}
