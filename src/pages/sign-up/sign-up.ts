import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  provider = 'email';
  photo = '/assets/imgs/user.png';


  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams, 
    public RENDERER: Renderer, 
    public VIEWCTRL: ViewController,
    public UTILS: UtilsProvider,
    public LOADER: PreloaderProvider,
    public ANGFIREAUTH: AngularFireAuth,
    public HTTPSERVICE: HttpServiceProvider) {
    this.RENDERER.setElementClass(VIEWCTRL.pageRef().nativeElement, 'my-popup', true);
  }

  validateData() {
    let valid = true;
    if(this.name == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Nome' deve ser preenchido.", 'error');
    }else if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }else if(this.password == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Senha' deve ser preenchido.", 'error');
    }else if(this.confirmPassword == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Confirmar Senha' deve ser preenchido.", 'error');
    }else if(this.password.length < 6){
      valid = false;
      this.UTILS.showMessage("A senha deve ter, no mínimo, 6 caracteres.", 'error');
    }else if(this.password != this.confirmPassword) {
      valid = false;
      this.UTILS.showMessage("Senha e Confirmar senha não correspondem.", 'error');
    }

    return valid;
  }

  signup() {
    if(this.validateData()){
      this.LOADER.displayPreloader();
      let _class = this;
      
      //signs up the user in firebase
      this.ANGFIREAUTH.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(credential => {
          //Signs up in the api
          this.HTTPSERVICE.saveUser(_class.name, _class.email, _class.provider, credential.uid, _class.photo)
            .subscribe(data => {
              firebase.auth().currentUser.sendEmailVerification()
                .then(success => {
                  _class.UTILS.showMessage('Enviamos um email de validação para o endereço cadastrado. Por favor, acesse sua caixa de emails e clique no link para validar o cadastro.', 'info');
                  _class.LOADER.hidePreloader();
                  _class.VIEWCTRL.dismiss({ success: data });
                }, err => {
                  console.log(err);
                  _class.UTILS.showMessage(err.message, 'error'); //msg do google é em EN/US. Mudar para mensagem padrão
                  _class.LOADER.hidePreloader();
                });  
            }, err => {
              console.log(err);
              _class.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
              this.LOADER.hidePreloader();
            }
          );
      }, err => {
        console.log(err);
        _class.UTILS.showMessage(err.message, 'error'); //msg do google é em EN/US. Mudar para mensagem padrão
        _class.LOADER.hidePreloader();
      }); 
    }
  }

}
