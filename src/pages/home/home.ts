import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results';
import { PreloaderProvider } from '../../providers/preloader/preloader';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider) {
  }

  ionViewDidLoad() {
    this.LOADER.hidePreloader();
  }

  search() {
    this.NAVCTRL.push(SearchResultsPage);
  }

}
