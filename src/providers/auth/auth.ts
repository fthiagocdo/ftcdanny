import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {
  activeUser = new BehaviorSubject({ 
    isLogged: false,
    id: '',
    provider: '',
    uid: '',
    name: '',
    email: '',
    photo: '',
    ddd: '',
    phoneNumber: '',
    postcode: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  constructor(
    public ANGULARFIREAUTH: AngularFireAuth, 
    public GOOGLEPLUS: GooglePlus, 
    public PLATFORM: Platform,
    public STORAGE: Storage) { }

  doLogin(user) {
    this.activeUser.next({ 
      isLogged: true,
      id: user.id,
      provider: user.provider,
      uid: user.uid,
      name: user.name,
      email: user.email,
      photo: user.photo,
      ddd: user.ddd,
      phoneNumber: user.phoneNumber,
      postcode: user.postcode,
      street: user.street,
      number: user.number,
      neighborhood: user.neighborhood,
      city: user.city,
      state: user.state
    });
  }

  doLogout() {
    this.activeUser.next({ 
      isLogged: false,
      id: '',
      provider: '',
      uid: '',
      name: '',
      email: '',
      photo: '',
      ddd: '',
      phoneNumber: '',
      postcode: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: ''
     });

    this.STORAGE.remove("UID");
    this.ANGULARFIREAUTH.auth.signOut();
    if(this.PLATFORM.is('cordova')){
      this.GOOGLEPLUS.logout();
    }
  }

}
