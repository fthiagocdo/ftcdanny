import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class VarGlobalProvider {

  status: boolean = false;

  constructor(
    public PLATFORM: Platform) { }

  setStatusScript(status: boolean) {
    this.status = status;
  }

  getStatusScript() {
    return this.status;
  }

  getUrlServiceApi() {
    if(this.PLATFORM.is('cordova')){
      return 'http://superh24horas.onlinewebshop.net/api/';
    }else{
      return 'http://localhost:8000/api/';
    }
  }

}
