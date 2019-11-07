import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuantityItemPage } from './quantity-item';

@NgModule({
  declarations: [
    QuantityItemPage,
  ],
  imports: [
    IonicPageModule.forChild(QuantityItemPage),
  ],
})
export class QuantityItemPageModule {}
