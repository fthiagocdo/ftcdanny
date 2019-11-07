import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderDetailPage } from '../order-detail/order-detail';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { CheckoutPage } from '../checkout/checkout';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { AuthProvider } from '../../providers/auth/auth';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {
  currentUser: any;
  orderHistories: any;
  showEmptyPageMessage: boolean = false;

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider,
    public HTTPSERVICE: HttpServiceProvider,
    public AUTH: AuthProvider,
    public UTILS: UtilsProvider) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.HTTPSERVICE.getOrderHistory(this.currentUser.id)
      .subscribe(data => {
        this.orderHistories = data;
        this.LOADER.hidePreloader();
      }, err=> {
        console.log(err);
        this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      });
  }

  orderDetail(checkoutId, orderNumber) {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(OrderDetailPage, {
      'checkoutId': checkoutId,
      'orderNumber': orderNumber
    });
  }

  goToCheckoutPage() {
    this.LOADER.displayPreloader();
    this.NAVCTRL.setRoot(CheckoutPage);
  }

}
