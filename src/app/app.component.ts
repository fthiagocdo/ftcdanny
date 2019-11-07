import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CheckoutPage } from '../pages/checkout/checkout';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { ProfilePage } from '../pages/profile/profile';
import { AuthProvider } from '../providers/auth/auth';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { UtilsProvider } from '../providers/utils/utils';
import { VarGlobalProvider } from '../providers/var-global/var-global';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pagesGuest: Array<{title: string, icon: string, component: any}>;
  pagesUser: Array<{title: string, icon: string, component: any}>;
  currentUser: any;

  constructor(
    public STATUSBAR: StatusBar, 
    public SPLASHSCREEN: SplashScreen,
    public PLATFORM: Platform,
    public AUTH : AuthProvider, 
    public LOADER: PreloaderProvider,
    public HTTPSERVICE: HttpServiceProvider,
    public UTILS: UtilsProvider,
    public VARGLOBAL: VarGlobalProvider) {

      this.initializeApp();
      this.loadConfigVars();

      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });

      this.pagesGuest = [
        { title: 'Página Inicial', icon: 'ftc-home', component: HomePage },
        { title: 'Entrar', icon:'ftc-login', component: LoginPage },
      ];
      this.pagesUser = [
        { title: 'Página Inicial', icon: 'ftc-home', component: HomePage },
        { title: 'Dados do Perfil', icon:'ftc-profile', component: ProfilePage },
        { title: 'Carrinho de Compras', icon:'ftc-cart', component: CheckoutPage },
        { title: 'Histórico de Pedidos', icon:'ftc-history', component: OrderHistoryPage },
        { title: 'Sair', icon:'ftc-logout', component: LoginPage },
      ];

  }

  initializeApp() {
    this.STATUSBAR.backgroundColorByHexString('#CD0045');
    this.PLATFORM.ready().then(() => {
      this.STATUSBAR.styleDefault();
      this.SPLASHSCREEN.hide();
    });
  }

  loadConfigVars() {
    this.HTTPSERVICE.getConfigVars()
      .subscribe(data => {
        console.log(data);
        if(!this.UTILS.isEmpty(data.url_pagseguro_direct_payment)){
          this.VARGLOBAL.setUrlPagSeguroDirectPayment(data.url_pagseguro_direct_payment);
        }
      }, err => {
        console.log(err);
        this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      });
  }

  openPage(page) {
    this.LOADER.displayPreloader();

    if(page.title == 'Sair'){
      this.AUTH.doLogout();
      this.nav.setRoot(LoginPage);
    }else{
      this.nav.setRoot(page.component);
    }
  }
}
