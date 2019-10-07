import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderDetailPage } from '../order-detail/order-detail';

@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams) {
  }

  orderDetail() {
    this.NAVCTRL.push(OrderDetailPage);
  }

}
