import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private navController: NavController) {}

  canActivate() {
    const isGuest = localStorage.getItem('isGuestHewanKita')
    const isRegistered = localStorage.getItem('isRegisteredHewanKita')
    const isLogin = localStorage.getItem('isLoginHewanKita');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('hewanKitaUserMobile');

    if(!isRegistered && !isGuest){
      this.navController.navigateForward('on-boarding', { replaceUrl: true });
      return false;
    }

    if(!isLogin && isGuest){
      return true
    }

    if (user && isLogin && token) {
      return true;
    }

    this.navController.navigateForward('auth/login', { replaceUrl: true });
    return false;
  }
}
