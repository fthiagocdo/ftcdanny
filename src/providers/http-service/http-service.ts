import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { VarGlobalProvider } from '../var-global/var-global';

@Injectable()
export class HttpServiceProvider {
  url: string = '';

  constructor(
    public HTTP: Http,
    public PLATFORM: Platform,
    public VARGLOBAIS: VarGlobalProvider) {
      this.url = VARGLOBAIS.getUrlServiceApi();
  }

  createHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  }
  
  //----------------------------------------------------------------------------------------------------------

  getConfigVars() {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.HTTP.get(this.url+'configvars', requestOptions)
      .map(res => {
        return res.json()
      });
  }

  //----------------------------------------------------------------------------------------------------------

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

  updateUser(id, name, ddd, phoneNumber, postcode, street, number, neighborhood, city, state) {
    const requestOptions = new RequestOptions({ headers: this.createHeader() });

    let data = {
      _method: 'PUT',
      name: name,
      ddd: ddd,
      phone_number: phoneNumber,
      postcode: postcode,  
      street: street,
      number: number,
      neighborhood: neighborhood,
      city: city,
      state: state
    };

    return this.HTTP.post(this.url+'users/'+id, data, requestOptions)
      .map(res => {
        return res.json()
      });

  }

  //------------------------------------------------------------------------------------------------------

  getProducts() {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.HTTP.get(this.url+'products', requestOptions)
      .map(res => {
        return res.json()
      });
  }

  searchProducts(key) {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.HTTP.get(this.url+'searchproduct/'+key, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  //-------------------------------------------------------------------------------------------------------

  getCheckout(userId) {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.HTTP.get(this.url+'checkouts/'+userId, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  addItemCheckout(userId, productId, quantity) {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    let data = {
      user_id: userId,
      product_id: productId,
      quantity: quantity  
    };

    return this.HTTP.post(this.url+'checkoutitems', data, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  changeQuantityItemCheckout(checkoutId, itemId, quantity) {
    const requestOptions = new RequestOptions({ headers: this.createHeader() });
    
    let data = {
      _method: 'PUT',
      item_id: itemId,
      quantity: quantity,
    };

    return this.HTTP.post(this.url+'checkoutitems/'+checkoutId, data, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  removeItemCheckout(checkoutId, itemId) {
    const requestOptions = new RequestOptions({ 
      headers: this.createHeader(),
      params: {item_id: itemId}
    });
    
    return this.HTTP.delete(this.url+'checkoutitems/'+checkoutId, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  saveDeliveryInfo(checkoutId, name, ddd, phoneNumber, postcode, street, number, neighborhood, city, state) {
    const requestOptions = new RequestOptions({ headers: this.createHeader() });

    let data = {
      checkout_id: checkoutId,
      name: name,
      ddd: ddd,
      phone_number: phoneNumber,
      postcode: postcode,  
      street: street,
      number: number,
      neighborhood: neighborhood,
      city: city,
      state: state
    };

    return this.HTTP.post(this.url+'checkoutdeliveryinfos', data, requestOptions)
      .map(res => {
        return res.json()
      });

  }

  saveCheckoutPayment(checkoutId, paymentId, paymentTimestamp) {
    const requestOptions = new RequestOptions({ headers: this.createHeader() });

    let data = {
      checkout_id: checkoutId,
      payment_id: paymentId,
      payment_timestamp: paymentTimestamp
    };

    return this.HTTP.post(this.url+'checkoutpayments', data, requestOptions)
      .map(res => {
        return res.json()
      });

  }

  //-----------------------------------------------------------------------------------------------------------------------------

  getOrderHistory(userId) {
    const requestOptions = new RequestOptions({ headers: this.createHeader() });

    return this.HTTP.get(this.url+'orderhistories/all/'+userId, requestOptions)
      .map(res => {
        return res.json()
      });

  }

  getOrderDetails(checkoutId) {
    const requestOptions = new RequestOptions({ headers: this.createHeader() });

    return this.HTTP.get(this.url+'orderhistories/details/'+checkoutId, requestOptions)
      .map(res => {
        return res.json()
      });

  }

}
