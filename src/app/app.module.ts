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
import { lucideChevronLeft, lucideChevronRight, lucideSendHorizontal, lucideMapPin } from '@ng-icons/lucide';
import { saxLocationBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { heroTrash, heroPlus, heroMinus, heroXMark, heroAdjustmentsHorizontal } from '@ng-icons/heroicons/outline';
import { saxMessageTextOutline } from '@ng-icons/iconsax/outline';
import { heroCheckCircleSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';
import { heroCheckCircleMini } from '@ng-icons/heroicons/mini';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SelectAdminPageModule } from './check-out/select-admin/select-admin.module';
import { CheckOutPageModule } from './check-out/check-out.module';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

const config: SocketIoConfig = { url: 'http://localhost:4040/', options: { transports: ['websocket']} };

@NgModule({
  declarations: [AppComponent, 
    ],
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
