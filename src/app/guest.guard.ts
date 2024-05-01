import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private navController: NavController) {}

  canActivate() {
    const isGuest = localStorage.getItem('isGuestHewanKita')
    const isLogin = localStorage.getItem('isLoginHewanKita');
    const user = localStorage.getItem('hewanKitaUserMobile');

    if (user && isLogin) {
      return true;
    }

    this.navController.navigateForward('auth/login');
    return false;
  }
}
