import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPageRoutingModule } from './menu-routing.module';
import { NgIconsModule } from '@ng-icons/core';
import { saxEdit2Bold } from '@ng-icons/iconsax/bold';
import { saxCalendar1Outline, saxProfile2userOutline } from '@ng-icons/iconsax/outline';
import { heroUser, heroEnvelope, heroXMark, heroHome,  heroBuildingStorefront, heroUserCircle, heroCheckCircle, heroXCircle } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid, heroXMarkSolid, heroCheckBadgeSolid, heroExclamationCircleSolid, } from '@ng-icons/heroicons/solid';
import { lucideChevronLeft, lucideImages, lucideGalleryHorizontalEnd, lucideKeyRound, lucideTrash2, lucidePhone, lucideStore, lucideLogOut, lucideChevronDown, lucideSettings, lucideTags, lucideMapPin, lucideAlertCircle, lucidePlus, lucideArrowDownNarrowWide, lucideArrowDownWideNarrow } from '@ng-icons/lucide';
import { akarEyeOpen, akarEyeSlashed } from '@ng-icons/akar-icons'
import { MenuPage } from './menu.page';
import { CorePipesModule } from 'src/pipes/pipes.module';
import { ShopPage } from './shop/shop.page';
import { SettingsPage } from './settings/settings.page';
import { CategoriesPage } from './categories/categories.page';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { DetailPage } from './shop/detail/detail.page';
import { SwiperModule } from 'swiper/angular';
import { ProfilePage } from './profile/profile.page';
import { AddressPage } from './address/address.page';
import { FormPage } from './address/form/form.page';
import { BannersPage } from './banners/banners.page';
import { FormPage as FormBannerPage }  from './banners/form/form.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { MaskitoDirective } from '@maskito/angular';
import { AdminsPage } from './admins/admins.page';
import { DetailPage as DetailAdmins } from './admins/detail/detail.page';
import { FormPage as FormAdmins } from './admins/form/form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePipesModule,
    SwiperModule,
    MaskitoDirective,
    NgIconsModule.withIcons({
      heroEnvelope,
      heroCheckCircle, 
      heroXCircle,
      saxProfile2userOutline,
      lucideArrowDownNarrowWide, 
      lucideArrowDownWideNarrow,
      saxCalendar1Outline,
      akarEyeOpen, 
      akarEyeSlashed,
      lucideImages, 
      lucideGalleryHorizontalEnd,
      lucideKeyRound, 
      lucideTrash2,
      lucidePhone,
      heroHome,
      lucidePlus,
      saxEdit2Bold,
      lucideAlertCircle,
      heroUserCircle,
      heroExclamationCircleSolid,
      lucideMapPin,
      heroBuildingStorefront,
      lucideChevronLeft,
      lucideStore,
      lucideLogOut,
      heroUser,
      heroCheckCircleSolid, 
      heroXMarkSolid,
      lucideChevronDown,
      lucideSettings,
      lucideTags,
      heroXMark,
      heroCheckBadgeSolid
    }),
    PickerComponent,
    MenuPageRoutingModule
  ],
  declarations: [MenuPage, ProfilePage, ShopPage, DetailPage, SettingsPage, CategoriesPage, AddressPage, FormPage, BannersPage, FormBannerPage, ChangePasswordPage, AdminsPage, DetailAdmins, FormAdmins]
})
export class MenuPageModule {}
