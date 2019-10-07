import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpServiceProvider {
  url: string = '';

  constructor(
    public HTTP: Http,
    public PLATFORM: Platform) {
      //if(this.PLATFORM.is('cordova')){
        this.url = 'http://superh24horas.onlinewebshop.net/api/';
      /*}else{
        this.url = 'http://localhost:8000/api/';
      }*/
  }

  createHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  }

  getUsers() {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.HTTP.get(this.url+'users', requestOptions)
      .map(res => {
        return res.json()
      });
  }

  findUser(uid) {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.HTTP.get(this.url+'users/'+uid, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  saveUser(name, email, provider, providerUid, photo) {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    let data = {
      name: name,
      email: email,
      provider: provider,
      provider_uid: providerUid,
      photo: photo    
    };

    return this.HTTP.post(this.url+'users', data, requestOptions)
      .map(res => {
        return res.json()
      });

  }

  updateUser(id, name, phoneNumber, postcode, street, neighborhood, city, state) {
    const requestOptions = new RequestOptions({ headers: this.createHeader() });

    let data = {
      _method: 'PUT',
      name: name,
      phone_number: phoneNumber,
      postcode: postcode,  
      street: street,
      neighborhood: neighborhood,
      city: city,
      state: state,    
    };

    return this.HTTP.post(this.url+'users/'+id, data, requestOptions)
      .map(res => {
        return res.json()
      });

  }

}
