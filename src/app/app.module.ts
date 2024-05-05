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
import { lucideChevronLeft, lucideCircleUserRound, lucideSmartphone, lucideLock, lucideLockKeyhole, lucideMail, lucideUnlockKeyhole,  lucideChevronRight, lucideSendHorizontal, lucideMapPin } from '@ng-icons/lucide';
import { saxLocationBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { saxMessageBold } from '@ng-icons/iconsax/bold';
import { heroTrash, heroPlus, heroMinus, heroXMark, heroAdjustmentsHorizontal } from '@ng-icons/heroicons/outline';
import { saxMessageTextOutline, saxCalendar1Outline } from '@ng-icons/iconsax/outline';
import { heroCheckCircleSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';
import { heroCheckCircleMini, heroEyeMini } from '@ng-icons/heroicons/mini';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SelectAdminPageModule } from './check-out/select-admin/select-admin.module';
import { CheckOutPageModule } from './check-out/check-out.module';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { NotificationsPage } from './notifications/notifications.page';

const config: SocketIoConfig = { url: 'http://localhost:4040/', options: { transports: ['websocket']} };

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
    NgIconsModule.withIcons({ 
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
      heroCheckCircleMini
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
