import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderDetailPage } from '../order-detail/order-detail';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { CheckoutPage } from '../checkout/checkout';

@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider) {
  }

  orderDetail() {
    this.NAVCTRL.push(OrderDetailPage);
  }

  goToCheckoutPage() {
    this.LOADER.displayPreloader();
    this.NAVCTRL.setRoot(CheckoutPage);
  }

}
