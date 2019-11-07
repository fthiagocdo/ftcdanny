import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class VarGlobalProvider {

  status: boolean = false;
  urlPagSeguroDirectPayment: string = '';

  constructor(
    public PLATFORM: Platform) { }

  setStatusScript(status: boolean) {
    this.status = status;
  }

  getStatusScript() {
    return this.status;
  }

  setUrlPagSeguroDirectPayment(urlPagSeguroDirectPayment: string) {
    this.urlPagSeguroDirectPayment = urlPagSeguroDirectPayment;
  }

  getUrlPagSeguroDirectPayment() {
    return this.urlPagSeguroDirectPayment;
  }

  getUrlServiceApi() {
    //if(this.PLATFORM.is('cordova')) {
      return 'http://superh24horas.com/api/';
    /*} else {
      return 'http://localhost:8000/api/';
    }*/
  }

}
