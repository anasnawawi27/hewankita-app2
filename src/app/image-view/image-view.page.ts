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

SwiperCore.use([Zoom]);

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

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  // zoom(zoomIn){
  //   const zoom = this.swiper.swiperRef.zoom;
  //   zoomIn ? zoom.in() : zoom.out();
  // }
}
