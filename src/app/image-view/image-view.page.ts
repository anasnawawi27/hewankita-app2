import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import SwiperCore, { Zoom, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener'
import write_blob from 'capacitor-blob-writer'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { Cloudinary } from '@cloudinary/url-gen';
import { cldConfig } from 'src/config/cloudinary.config';
import { Capacitor } from '@capacitor/core';


SwiperCore.use([Zoom]);

interface CustomFile {
  title: string, 
  url: string, 
  path: string, 
  mineType: string 
}

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.page.html',
  styleUrls: ['./image-view.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageViewPage implements OnInit {
  @Input() img: any = {cloud: false, file: null};
  @ViewChild('swiper') swiper!: SwiperComponent;

  config: SwiperOptions = {
    zoom: true,
  };

  progress = 0 // If you wish to show a loader :)
  downloadingUrls: any = [] // Avoid downloading multiple time the same asset

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    ) {}

  ngOnInit() {

  }

  close() {
    this.modalController.dismiss();
  }

  download(){
      const cld = new Cloudinary(cldConfig);
      const URL = cld.image(this.img.file).toURL();

      if (Capacitor.isNativePlatform()) {
        this.http.get(URL, {
          responseType: 'blob',
          reportProgress: true,
          observe: 'events'
          }
        ).subscribe(async (event: any) => {
          if(event.type == HttpEventType.DownloadProgress){
            this.progress = Math.round((100 * event.loaded) / event.total)
          } else if(event.type == HttpEventType.Response){
            // const mimeType = event.body.type;
            const mimeType = 'image/png';
            const name = this.img + '.' + mimeType.split('/')[1];
            const base64 = await this.convertBlobToBase64(event.body) as string;
  
            const savedFile = await Filesystem.writeFile({
              path: name,
              data: base64,
              directory: Directory.Documents
            })
  
            const options: FileOpenerOptions = {
              filePath: savedFile.uri,
              contentType: mimeType,
            };
  
            this.progress = 0;
            await FileOpener.open(options);
          }
        })
      } else {
        const mimeType = 'image/png';
        const name = this.img + '.' + mimeType.split('/')[1];
        this.http
          .get(URL, { responseType: 'blob' as 'json' })
          .subscribe((res: any) => {
            const file = new Blob([res], { type: res.type });
  
            const blob = window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = blob;
            link.download = name;
  
            // Version link.click() to work at firefox
            link.dispatchEvent(
              new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
              }),
            );
  
            setTimeout(() => {
              // firefox
              window.URL.revokeObjectURL(blob);
              link.remove();
            }, 100);
  
          });
      }
  }

  zoom(zoomIn: boolean){
    const zoom = this.swiper.swiperRef.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  }) 

}
