import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { UtilsProvider } from '../../providers/utils/utils';
import { DeliveryInfoPage } from '../delivery-info/delivery-info';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  currentUser: any;
  checkout: any;
  checkoutItems: any;
  showEmptyCartMessage: boolean = false;
  showCartItems: boolean = false;

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public MODALCTRL: ModalController,
    public AUTH: AuthProvider,
    public LOADER: PreloaderProvider,
    public HTTPSERVICE: HttpServiceProvider,
    public UTILS: UtilsProvider,
    public ALERTCTRL: AlertController) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.getCheckout();
  }

  getCheckout() {
    this.LOADER.displayPreloader();
    let _class = this;

    this.HTTPSERVICE.getCheckout(this.currentUser.id)
      .subscribe(data => { 
        _class.verifyCart(data);
      }, err => {
        console.log(err);
        _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );
  }

  removeItemCheckout(itemId) {
    this.LOADER.displayPreloader();
    let _class = this;

    this.HTTPSERVICE.removeItemCheckout(this.checkout.id, itemId)
      .subscribe(data => { 
        _class.verifyCart(data);
      }, err => {
        console.log(err);
        _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );
  }

  verifyCart(data) {
    if(data.checkoutItems.length > 0) {
      this.showEmptyCartMessage = false;
      this.showCartItems = true;
    } else {
      this.showEmptyCartMessage = true;
      this.showCartItems = false;
    }
    
    this.checkout = data.checkout;
    this.checkoutItems = data.checkoutItems;
    this.LOADER.hidePreloader();
  }

  goToDeliveryInfo() {
    if(this.UTILS.isEmpty(this.currentUser.street)) {
      let alert = this.ALERTCTRL.create({
        title: 'Por favor, complete seu cadastro antes de realizar esta ação.',
        buttons: [{
          text: 'OK',
          cssClass: 'ftc-alert-info-button ftc-modal-button',
          handler: () => {
            this.LOADER.displayPreloader;
            this.NAVCTRL.push(ProfilePage);
          }
        }],
        cssClass: 'ftc-info-color'
      });
      alert.present();
    } else {
      this.LOADER.displayPreloader;
      this.NAVCTRL.push(DeliveryInfoPage, {
        'checkoutId': this.checkout.id,
        'valuePayment': this.checkout.total_value
      });
    }
  }

}
