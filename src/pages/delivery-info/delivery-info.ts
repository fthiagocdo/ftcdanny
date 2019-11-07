import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { UtilsProvider } from '../../providers/utils/utils';
import { AuthProvider } from '../../providers/auth/auth';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { PaymentPage } from '../payment/payment';

@IonicPage()
@Component({
  selector: 'page-delivery-info',
  templateUrl: 'delivery-info.html',
})
export class DeliveryInfoPage {
  selectOptions: any = {
    title: 'Selecione estado'
  };
  currentUser: any;
  checkoutId: string = '';
  ddd: string = '';
  phoneNumber: string = '';
  postcode: string = '';  
  street: string = '';
  number: string = '';
  neighborhood: string = '';
  city: string = '';
  state: string = '';
  valuePayment: string = '';
  minPostcodeRange: number = 93300000;
  maxPostcodeRange: number = 93800000;

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public UTILS: UtilsProvider,
    public LOADER: PreloaderProvider,
    public AUTH: AuthProvider,
    public HTTPSERVICE: HttpServiceProvider) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.checkoutId = this.NAVPARAMS.get('checkoutId');
    this.valuePayment = this.NAVPARAMS.get('valuePayment');
    this.ddd = this.currentUser.ddd;
    this.phoneNumber = this.currentUser.phoneNumber;
    this.postcode = this.currentUser.postcode;  
    this.street = this.currentUser.street;
    this.number = this.currentUser.number;
    this.neighborhood = this.currentUser.neighborhood;
    this.city = this.currentUser.city;
    this.state = this.currentUser.state;
    this.LOADER.hidePreloader();
  }

  cleanAll() {
    this.ddd = '';
    this.phoneNumber = '';
    this.postcode = '';  
    this.street = '';
    this.number = '';
    this.neighborhood = '';
    this.city = '';
    this.state = '';
  }

  validateData() {
    let valid = true;
    if(this.ddd == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Telefone de Contato' deve ser preenchido.", 'error');
    } else if(this.ddd != this.UTILS.justNumbers(this.ddd)) {
      valid = false;
      this.UTILS.showMessage("O campo 'Telefone de Contato' deve possuir apenas números.", 'error');
    } else if(this.phoneNumber == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Telefone de Contato' deve ser preenchido.", 'error');
    } else if(this.phoneNumber != this.UTILS.justNumbers(this.phoneNumber)) {
      valid = false;
      this.UTILS.showMessage("O campo 'Telefone de Contato' deve possuir apenas números.", 'error');
    } else if(this.postcode == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'CEP' deve ser preenchido.", 'error');
    } else if(this.postcode != this.UTILS.justNumbers(this.postcode)) {
      valid = false;
      this.UTILS.showMessage("O campo 'CEP' deve possuir apenas números.", 'error');
    } else if(Number(this.postcode) < this.minPostcodeRange || Number(this.postcode) > this.maxPostcodeRange) {
      valid = false;
      this.UTILS.showMessage("Desculpe, mas ainda não estamos realizando entregas no endereço informado.", 'error');
    } else if(this.street == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Rua' deve ser preenchido.", 'error');
    } else if(this.neighborhood == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Bairro' deve ser preenchido.", 'error');
    } else if(this.city == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Cidade' deve ser preenchido.", 'error');
    } else if(this.state == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Estado' deve ser preenchido.", 'error');
    }

    return valid;
  }

  confirmDeliveryInfo() {
    if(this.validateData()) {
      let _class = this;
      this.LOADER.displayPreloader();
      
      this.HTTPSERVICE.saveDeliveryInfo(
          this.checkoutId, 
          this.currentUser.name, 
          this.ddd,
          this.phoneNumber, 
          this.postcode, 
          this.street, 
          this.number,
          this.neighborhood, 
          this.city, 
          this.state
        ).subscribe(data => { 
          _class.NAVCTRL.push(PaymentPage, {
            'checkoutId': _class.checkoutId,
            'valuePayment': _class.valuePayment
          });
        }, err => {
          console.log(err);
          _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
          this.LOADER.hidePreloader();
        }
      );
    }
  }

}
