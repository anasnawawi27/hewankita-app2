import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from 'src/services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from 'src/services/toast.service';
import { UploadService } from 'src/services/upload.service';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgIconsModule } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronDown, lucidePencil, lucidePlus, lucideCircleUserRound, lucideSmartphone, lucideLock, lucideLockKeyhole, lucideMail, lucideUnlockKeyhole,  lucideChevronRight, lucideSendHorizontal, lucideMapPin, lucideUserCog, lucideUserPlus } from '@ng-icons/lucide';
import { saxLocationBulk, saxTickCircleBulk, saxVerifyBulk } from '@ng-icons/iconsax/bulk';
import { saxMessageBold, saxVerifyBold } from '@ng-icons/iconsax/bold';
import { heroTrash, heroPlus, heroMinus, heroXMark, heroAdjustmentsHorizontal, heroUserCircle } from '@ng-icons/heroicons/outline';
import { saxMessageTextOutline, saxCalendar1Outline, } from '@ng-icons/iconsax/outline';
import { heroCheckCircleSolid, heroXMarkSolid, heroCameraSolid, heroPhotoSolid } from '@ng-icons/heroicons/solid';
import { heroCheckCircleMini, heroEyeMini, heroEyeSlashMini } from '@ng-icons/heroicons/mini';
import {hugeUserEdit01, hugeUserSettings01} from '@ng-icons/huge-icons';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SelectAdminPageModule } from './check-out/select-admin/select-admin.module';
import { CheckOutPageModule } from './check-out/check-out.module';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { NotificationsPage } from './notifications/notifications.page';
import { CommonModule } from '@angular/common';

const config: SocketIoConfig = { url: 'https://hewankita-chat.rilisaplikasi.com/', options: { transports: ['websocket']} };
// const config: SocketIoConfig = { url: 'http://localhost:4040/', options: { transports: ['websocket']} };

@NgModule({
  declarations: [AppComponent, NotificationsPage ],
  imports: [
    CheckOutPageModule,
    SelectAdminPageModule,
    TagInputModule, 
    FormsModule,
    ReactiveFormsModule, 
    BrowserModule, 
    BrowserAnimationsModule,
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule, 
    CorePipesModule,
    PickerComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ 
      heroCameraSolid, 
      heroPhotoSolid,
      lucideChevronDown,
      lucidePencil,
      lucidePlus,
      heroEyeSlashMini,
      saxVerifyBulk,
      saxVerifyBold,
      saxCalendar1Outline,
      lucideCircleUserRound, 
      lucideSmartphone, 
      lucideLock, 
      lucideLockKeyhole,
      heroEyeMini,
      lucideMail, 
      lucideUnlockKeyhole,
      saxMessageBold,
      saxTickCircleBulk,
      lucideChevronLeft, 
      lucideChevronRight, 
      saxLocationBulk, 
      heroTrash, 
      heroPlus, 
      heroMinus, 
      lucideMapPin,
      saxMessageTextOutline, 
      heroXMark,
      heroCheckCircleSolid,
      heroAdjustmentsHorizontal,
      heroXMarkSolid,
      lucideSendHorizontal,
      heroCheckCircleMini,
      lucideUserCog,
      lucideUserPlus,
      heroUserCircle,
      hugeUserEdit01,
      hugeUserSettings01
    }),
    SocketIoModule.forRoot(config)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },     ApiService,
    ToastService,
    HttpClientModule,
    UploadService,
    provideHotToastConfig()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
