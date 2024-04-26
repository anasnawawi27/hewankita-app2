import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilePage implements OnInit {

  public user: any = JSON.parse(localStorage.getItem('hewanKitaUserMobile') || '{}');

  constructor(
    private navController: NavController
  ) {
    console.log(this.user)
   }

  ngOnInit() {
  }

  back(){
    this.navController.back()
  }

}
