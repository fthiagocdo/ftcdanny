import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { RecoverPasswordPage } from '../pages/recover-password/recover-password';
import { CheckoutPage } from '../pages/checkout/checkout';
import { DeliveryInfoPage } from '../pages/delivery-info/delivery-info';
import { PaymentPage } from '../pages/payment/payment';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { ProfilePage } from '../pages/profile/profile';
import { QuantityItemPage } from '../pages/quantity-item/quantity-item';

import { UtilsProvider } from '../providers/utils/utils';
import { AuthProvider } from '../providers/auth/auth';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { IonicStorageModule } from '@ionic/storage';
import { PagseguroPgtoServiceProvider } from '../providers/pagseguro-pgto-service/pagseguro-pgto-service';
import { VarGlobalProvider } from '../providers/var-global/var-global';
import { DatePipe } from '@angular/common';

export const firebaseConfig = {
  apiKey: "AIzaSyB363UGELAVLRCZjEsdNn5-hXFgijXDNGY",
  authDomain: "super-h-app.firebaseapp.com",
  databaseURL: "https://super-h-app.firebaseio.com",
  projectId: "super-h-app",
  storageBucket: "",
  messagingSenderId: "278302234775",
  appId: "1:278302234775:web:607427426f07e035cd71d2",
  measurementId: "G-L4C822KVDY"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QuantityItemPage,
    LoginPage,
    SignUpPage,
    RecoverPasswordPage,
    ProfilePage,
    CheckoutPage,
    DeliveryInfoPage,
    PaymentPage,
    OrderHistoryPage,
    OrderDetailPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    IonicStorageModule.forRoot({name: '__superh24horasbd'}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QuantityItemPage,
    LoginPage,
    SignUpPage,
    RecoverPasswordPage,
    ProfilePage,
    CheckoutPage,
    DeliveryInfoPage,
    PaymentPage,
    OrderHistoryPage,
    OrderDetailPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    Facebook,
    UtilsProvider,
    AuthProvider,
    PreloaderProvider,
    HttpServiceProvider,
    VarGlobalProvider,
    DatePipe,
    PagseguroPgtoServiceProvider
  ]
})
export class AppModule {}
