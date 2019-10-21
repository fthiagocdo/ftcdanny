import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { AuthProvider } from '../../providers/auth/auth';
import { UtilsProvider } from '../../providers/utils/utils';
import { CheckoutPage } from '../checkout/checkout';
import { Storage } from '@ionic/storage';
import { PagseguroPgtoServiceProvider } from '../../providers/pagseguro-pgto-service/pagseguro-pgto-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  currentUser: any;
  products: any;
  searchKey: string = '';
  showClearButton: boolean = false;

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider,
    public HTTPSERVICE: HttpServiceProvider,
    public AUTH: AuthProvider,
    public UTILS: UtilsProvider,
    public PLATFORM: Platform,
    public STORAGE: Storage,
    public PAGSEG: PagseguroPgtoServiceProvider) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    if(this.PLATFORM.is('cordova')){
      this.getDetailsKeepmeLogged();
    }else{
      this.LOADER.hidePreloader();
    }
    
    /*this.PAGSEG.getSession()
      .subscribe(data => { 
        console.log(data);
        this.PAGSEG.init(data, true)
          .then(data => { 
            console.log(data);
            this.LOADER.hidePreloader();
          }, err => {
            console.log(err);
            this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
            this.LOADER.hidePreloader();
          }
        );
      }, err => {
        console.log(err);
        this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );*/
    
    this.getProducts();
  }

  executarMetodo() {
    this.LOADER.displayPreloader();
    this.PAGSEG.initiatePayment()
      .then(data => { 
        console.log(data);
        this.PAGSEG.sendPaymentToServer()
          .subscribe(data => { 
            console.log(data);
            this.LOADER.hidePreloader();
          }, err => {
            console.log(err);
            this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
            this.LOADER.hidePreloader();
          }
        );
      }, err => {
        console.log(err);
        this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );
  }

  getProducts() {
    this.LOADER.displayPreloader();
    this.products = [];
    let _class = this;

    this.HTTPSERVICE.getProducts()
      .subscribe(data => { 
        _class.products = data;
        this.LOADER.hidePreloader();
      }, err => {
        console.log(err);
        _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );
  }

  searchProducts() {
    this.LOADER.displayPreloader();
    this.products = [];
    let _class = this;

    this.HTTPSERVICE.searchProducts(this.searchKey)
      .subscribe(data => { 
        if(data.length > 0) {
          _class.products = data;
          _class.showClearButton = true;
          this.LOADER.hidePreloader();
        } else {
          _class.showClearButton = true;
          _class.UTILS.showMessage('Não há resultados para esta consulta.', 'info'); 
          this.LOADER.hidePreloader();
        }
      }, err => {
        console.log(err);
        _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );
  }

  clearSearch() {
    this.showClearButton = false;
    this.searchKey = '';
    this.products = [];
    this.getProducts();
  }

  addItemCheckout(productId) {
    if(this.currentUser.isLogged) {
      this.LOADER.displayPreloader();
      let _class = this;

      this.HTTPSERVICE.addItemCheckout(this.currentUser.id, productId)
        .subscribe(data => { 
          _class.UTILS.showMessage('Item adicionado ao seu carrinho de compras.', 'info');
          this.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
          this.LOADER.hidePreloader();
        }
      );
    } else {
      this.UTILS.showMessage('Por favor, realize login para executar esta ação.', 'info');
    }
  }

  goToCheckoutPage() {
    this.LOADER.displayPreloader();
    this.NAVCTRL.setRoot(CheckoutPage);
  }

  getDetailsKeepmeLogged() {
    this.LOADER.displayPreloader();
    let _class = this;
    
    this.STORAGE.get("UID")
      .then((val) => {
        _class.keepmeLogged(val);
      }, err => {
        console.log(err);
        _class.UTILS.showMessage('getDetailsKeepmeLogged: Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        _class.LOADER.hidePreloader();
      });
  }

  keepmeLogged(uid) {
    if(this.UTILS.isEmpty(uid)) {
      this.LOADER.hidePreloader;
    } else {
      this.LOADER.displayPreloader();
      let _class = this;
      
      this.HTTPSERVICE.findUser(uid)
        .subscribe(data => { 
          this.currentUser.id = data.id
          this.currentUser.name = data.name
          this.currentUser.email = data.email;
          this.currentUser.provider = data.provider;
          this.currentUser.uid = data.uid;
          this.currentUser.photo = data.photo;
          
          if(data.delivery_info) {
            this.currentUser.phoneNumber = data.delivery_info.phone_number;
            this.currentUser.postcode = data.delivery_info.postcode;
            this.currentUser.street = data.delivery_info.street;
            this.currentUser.neighborhood = data.delivery_info.neighborhood;
            this.currentUser.city = data.delivery_info.city;
            this.currentUser.state = data.delivery_info.state;
          }

          this.AUTH.doLogin(this.currentUser);
          this.LOADER.hidePreloader;
        }, err => {
          console.log(err);
          _class.UTILS.showMessage('keepmeLogged: Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
          this.LOADER.hidePreloader();
        }
      );
    }
  }

}
