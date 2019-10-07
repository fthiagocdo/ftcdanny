import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryAddressPage } from '../delivery-address/delivery-address';
import { PaymentPage } from '../payment/payment';

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public MODALCTRL: ModalController) {
  }

  openModalDeliveryAddress() {
    let modalDeliveryAddress = this.MODALCTRL.create(DeliveryAddressPage, {
      showBackdrop: true, 
      enableBackdropDismiss: true
    });
    modalDeliveryAddress.present();

    modalDeliveryAddress.onDidDismiss((result) =>{
      this.NAVCTRL.push(PaymentPage);
    });
  }

}
