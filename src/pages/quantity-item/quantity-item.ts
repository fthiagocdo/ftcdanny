import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-quantity-item',
  templateUrl: 'quantity-item.html',
})
export class QuantityItemPage {
  quantity: number = 0;
  productId: string = '';
  userId: string = '';

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public RENDERER: Renderer,
    public VIEWCTRL: ViewController,
    public LOADER: PreloaderProvider,
    public HTTPSERVICE: HttpServiceProvider,
    public UTILS: UtilsProvider) {
      this.RENDERER.setElementClass(VIEWCTRL.pageRef().nativeElement, 'my-popup', true);
  }

  ionViewDidLoad() {
    this.productId = this.NAVPARAMS.get('productId');
    this.userId = this.NAVPARAMS.get('userId');
    this.quantity = this.NAVPARAMS.get('quantity') == null ? 1 : this.NAVPARAMS.get('quantity');    
  }

  confirm() {
    this.LOADER.displayPreloader();
    this.VIEWCTRL.dismiss({quantity: this.quantity});
  }

  plusItem() {
    this.quantity += 1;
  }

  minusItem() {
    if(this.quantity > 0){
      this.quantity -= 1;
    }
  }

}
