import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';

import { UtilsProvider } from '../../providers/utils/utils';
import { PagseguroPgtoServiceProvider } from '../../providers/pagseguro-pgto-service/pagseguro-pgto-service';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  yearValues: any = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  currentUser: any = [];
  numCard: string = '';
  expiryDate: string = '';
  codSegCard: string = '';
  cardHolderName: string = '';
  cardHolderCPF: string = '';
  cardHolderBirthDate: string = '';
  checkoutId: string = '';
  valuePayment: string = '';
  
  constructor(
    public NAVCTRL: NavController, 
    public LOADER: PreloaderProvider,
    public UTILS: UtilsProvider,
    public PAGSEG: PagseguroPgtoServiceProvider,
    public AUTH: AuthProvider,
    public NAVPARAMS: NavParams) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.checkoutId = this.NAVPARAMS.get('checkoutId');
    this.valuePayment = this.NAVPARAMS.get('valuePayment');
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.numCard == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Número do Cartão' deve ser preenchido.", 'error');
    } else if(this.expiryDate == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Data de Expiração' deve ser preenchido.", 'error');
    } else if(this.codSegCard == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Código de Segurança' deve ser preenchido.", 'error');
    } else if(this.cardHolderName == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Nome' deve ser preenchido.", 'error');
    } else if(this.cardHolderCPF == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'CPF' deve ser preenchido.", 'error');
    } else if(this.cardHolderCPF != this.UTILS.justNumbers(this.cardHolderCPF)) {
      valid = false;
      this.UTILS.showMessage("O campo 'CPF' deve possuir apenas números.", 'error');
    } else if(this.cardHolderBirthDate == '') {
      valid = false;
      this.UTILS.showMessage("O campo 'Data de Nascimento' deve ser preenchido.", 'error');
    }

    return valid;
  }

  confirmPayment() {
    if(this.validateData) {
      this.PAGSEG.dados.numCard = this.numCard;
      this.PAGSEG.dados.mesValidadeCard = this.expiryDate.split('/')[0];
      this.PAGSEG.dados.anoValidadeCard = this.expiryDate.split('/')[1];
      this.PAGSEG.dados.codSegCard = this.codSegCard;
      this.PAGSEG.dados.nome = this.cardHolderName;
      this.PAGSEG.dados.cpf = this.cardHolderCPF;
      this.PAGSEG.dados.ddd = this.currentUser.ddd;
      this.PAGSEG.dados.telefone = this.currentUser.phoneNumber;
      this.PAGSEG.dados.nascimento = this.cardHolderBirthDate;
      this.PAGSEG.dados.email = this.currentUser.email;
      this.PAGSEG.dados.cep = this.currentUser.postcode;
      this.PAGSEG.dados.logradouro = this.currentUser.street;
      this.PAGSEG.dados.numero = this.currentUser.number;
      this.PAGSEG.dados.bairro = this.currentUser.neighborhood;
      this.PAGSEG.dados.cidade = this.currentUser.city;
      this.PAGSEG.dados.estado = this.currentUser.state;
    }
  }

}
