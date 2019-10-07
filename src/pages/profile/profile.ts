import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AuthProvider } from '../../providers/auth/auth';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  currentUser: any;
  provider: string = '';
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  postcode: string = '';  
  street: string = '';
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
    this.phoneNumber = this.currentUser.phoneNumber;
    this.postcode = this.currentUser.postcode;  
    this.street = this.currentUser.street;
    this.neighborhood = this.currentUser.neighborhood;
    this.city = this.currentUser.city;
    this.state = this.currentUser.state;
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.name == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Nome' deve ser preenchido.", 'error');
    }else if(this.phoneNumber == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Telefone de Contato' deve ser preenchido.", 'error');
    }else if(this.postcode == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'CEP' deve ser preenchido.", 'error');
    }else if(this.street == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Rua' deve ser preenchido.", 'error');
    }else if(this.neighborhood == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Bairro' deve ser preenchido.", 'error');
    }else if(this.city == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Cidade' deve ser preenchido.", 'error');
    }else if(this.state == ''){
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
          this.phoneNumber, 
          this.postcode, 
          this.street, 
          this.neighborhood, 
          this.city, 
          this.state
        ).subscribe(data => { 
          _class.currentUser.name = data.name;
          _class.currentUser.phoneNumber = data.phoneNumber; 
          _class.currentUser.postcode = data.postcode; 
          _class.currentUser.street = data.street; 
          _class.currentUser.neighborhood = data.neighborhood; 
          _class.currentUser.city = data.city; 
          _class.currentUser.state = data.state;
          _class.AUTH.doLogin(_class.currentUser);

          _class.UTILS.showMessage('Dados alterados com sucesso.', 'info');
          this.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
          this.LOADER.hidePreloader();
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
      cssClass: 'primary-color'
    });
    alert.present();
  }

  sendEmailChangePassword() {
    this.LOADER.displayPreloader();
    let _class = this;
    
    this.ANGFIREAUTH.auth.sendPasswordResetEmail(this.email)
      .then(success => {
        this.UTILS.showMessage("Por favor, verifique sua caixa de emails e clique no link para alterar sua senha.");
        _class.LOADER.hidePreloader();
    }, err => {
      console.log(err);
      _class.UTILS.showMessage(err.message, 'error');
      _class.LOADER.hidePreloader();
    });
  }

}
