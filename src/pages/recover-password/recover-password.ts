import { Component, Renderer } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {
  private email: string = "";

  constructor(
    private RENDERER: Renderer, 
    private VIEWCTRL: ViewController,
    private UTILS: UtilsProvider,
    private LOADER: PreloaderProvider,
    private ANGFIREAUTH: AngularFireAuth) {
    this.RENDERER.setElementClass(VIEWCTRL.pageRef().nativeElement, 'my-popup', true);
  }

  validateData() {
    let valid = true;
    if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }

    return valid;
  }

  recoverPassword() {
    if(this.validateData()){
      this.LOADER.displayPreloader();
      let _class = this;
      
      this.ANGFIREAUTH.auth.sendPasswordResetEmail(this.email)
        .then(success => {
          _class.VIEWCTRL.dismiss({ success: true });
          this.UTILS.showMessage("Por favor, verifique sua caixa de emails e clique no link para alterar sua senha.");
          _class.LOADER.hidePreloader();
      }, err => {
        console.log(err);
        _class.UTILS.showMessage(err.message, 'error');
        _class.LOADER.hidePreloader();
      });
    }
  }

}

