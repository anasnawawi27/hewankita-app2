import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';

import { CountdownModule } from 'ngx-countdown';
import { NgIconsModule } from '@ng-icons/core';
import { lucideChevronLeft, lucideLockKeyhole, lucideSmartphone, lucideCircleUserRound, lucideLock, lucideEye, lucideEyeOff, lucideMail, lucideUnlockKeyhole } from '@ng-icons/lucide';
import { heroEyeMini, heroEyeSlashMini } from '@ng-icons/heroicons/mini'
import { VerificationPage } from './verification/verification.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    CountdownModule,
    MaskitoDirective,
    NgIconsModule.withIcons({ 
      lucideMail, 
      lucideLock, 
      lucideEye, 
      lucideEyeOff, 
      lucideUnlockKeyhole, 
      heroEyeMini, 
      heroEyeSlashMini,
      lucideCircleUserRound,
      lucideSmartphone,
      lucideLockKeyhole,
      lucideChevronLeft,
   }),
  ],
  declarations: [LoginPage, RegisterPage, VerificationPage, ForgotPasswordPage],
})
export class AuthPageModule {}
