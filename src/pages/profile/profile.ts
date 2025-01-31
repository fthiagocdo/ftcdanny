import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AuthProvider } from '../../providers/auth/auth';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { CheckoutPage } from '../checkout/checkout';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  selectOptions: any = {
    title: 'Selecione estado'
  };
  currentUser: any;
  provider: string = '';
  name: string = '';
  email: string = '';
  ddd: string = '';
  phoneNumber: string = '';
  postcode: string = '';  
  street: string = '';
  number: string = '';
  neighborhood: string = '';
  city: string = '';
  state: string = '';

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public UTILS: UtilsProvider,
    public LOADER: PreloaderProvider,
    public AUTH: AuthProvider,
    public HTTPSERVICE: HttpServiceProvider,
    public ANGFIREAUTH: AngularFireAuth,
    public ALERTCTRL: AlertController) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.provider = this.currentUser.provider;
    this.name = this.currentUser.name;
    this.email = this.currentUser.email;
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

  validateData() {
    let valid = true;
    if(this.name == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Nome' deve ser preenchido.", 'error');
    } else if(this.ddd == '') {
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

  updateProfile() {
    if(this.validateData()) {
      let _class = this;
      this.LOADER.displayPreloader();
      
      this.HTTPSERVICE.updateUser(
          this.currentUser.id, 
          this.name, 
          this.ddd,
          this.phoneNumber, 
          this.postcode, 
          this.street,
          this.number, 
          this.neighborhood, 
          this.city, 
          this.state
        ).subscribe(data => { 
          _class.currentUser.name = data.name;
          _class.currentUser.ddd = data.delivery_info.ddd; 
          _class.currentUser.phoneNumber = data.delivery_info.phone_number; 
          _class.currentUser.postcode = data.delivery_info.postcode; 
          _class.currentUser.street = data.delivery_info.street;
          _class.currentUser.number = data.delivery_info.number;  
          _class.currentUser.neighborhood = data.delivery_info.neighborhood; 
          _class.currentUser.city = data.delivery_info.city; 
          _class.currentUser.state = data.delivery_info.state;
          _class.AUTH.doLogin(_class.currentUser);

          _class.UTILS.showMessage('Dados alterados com sucesso.', 'info');
          _class.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
          _class.LOADER.hidePreloader();
        }
      );
    }
  }

  changePassword() {
    let alert = this.ALERTCTRL.create({
      title: 'Deseja alterar sua senha?',
      buttons: [{
        text: 'Sim',
        cssClass: 'ftc-yes-button',
        handler: () => {
          this.LOADER.displayPreloader;
          this.sendEmailChangePassword();  
        }
      }, {
        text: 'Não',
        cssClass: 'ftc-no-button',
        handler: () => {
          this.AUTH.doLogout();
        }
      }],
      cssClass: 'ftc-color-primary'
    });
    alert.present();
  }

  sendEmailChangePassword() {
    this.LOADER.displayPreloader();
    let _class = this;
    
    this.ANGFIREAUTH.auth.sendPasswordResetEmail(this.email)
      .then(success => {
        _class.UTILS.showMessage("Por favor, verifique sua caixa de emails e clique no link para alterar sua senha.");
        _class.LOADER.hidePreloader();
    }, err => {
      console.log(err);
      _class.UTILS.showMessage(err.message, 'error');
      _class.LOADER.hidePreloader();
    });
  }

  goToCheckoutPage() {
    this.LOADER.displayPreloader();
    this.NAVCTRL.setRoot(CheckoutPage);
  }

}
