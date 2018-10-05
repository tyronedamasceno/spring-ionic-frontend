import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  credenciais : CredenciaisDTO = {
    email: "",
    senha: ""
  };

  constructor(
      public navCtrl: NavController, 
      public menu: MenuController,
      public auth: AuthService,
      public loadingCtrl: LoadingController) {

  }

  login() {
    let loader = this.presentLoading();
    this.auth.authenticate(this.credenciais)
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      },
      error => {});  
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

}
