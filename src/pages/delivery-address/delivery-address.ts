import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-delivery-address',
  templateUrl: 'delivery-address.html',
})
export class DeliveryAddressPage {

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public RENDERER: Renderer, 
    public VIEWCTRL: ViewController,) {
      this.RENDERER.setElementClass(VIEWCTRL.pageRef().nativeElement, 'my-popup', true);
  }

  confirm() {
    this.VIEWCTRL.dismiss(true);
  }

}
