import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { CheckoutPage } from '../checkout/checkout';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  checkout: any;
  checkoutItems: any;
  checkoutPayment: any;
  orderNumber: string = '';
  partialValue: string = '';
  deliveryFee: string = '';
  totalValue: string = '';
  checkoutId: string = '';
  showCartItems: boolean = false;

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider,
    public HTTPSERVICE: HttpServiceProvider,
    public UTILS: UtilsProvider) {
  }

  ionViewDidLoad() {
    this.orderNumber = this.UTILS.leftPad(this.NAVPARAMS.get('orderNumber'), '0', 6);
    this.checkoutId = this.NAVPARAMS.get('checkoutId');
    this.getDetails();
  }

  getDetails() {
    this.HTTPSERVICE.getOrderDetails(this.checkoutId)
      .subscribe(data => { 
        this.checkout = data.checkout;
        this.checkoutItems = data.checkoutItems;
        this.checkoutPayment = data.checkoutPayment;
        this.partialValue = data.checkout.partial_value;
        this.deliveryFee = data.checkout.delivery_fee;
        this.totalValue = data.checkout.total_value;
        this.showCartItems = true;
        this.LOADER.hidePreloader();
      }, err => {
        console.log(err);
        this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );
  }

  goToCheckoutPage() {
    this.LOADER.displayPreloader();
    this.NAVCTRL.setRoot(CheckoutPage);
  }

}
