import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class UtilsProvider {

  constructor(
    private ALERTCTRL: AlertController) { 
    }

  showMessage(message, messageType?) {
      if(message != null){
        if(messageType == 'error'){
          let alert = this.ALERTCTRL.create(  {
            title: message,
            buttons: [{
              text: 'Fechar',
              cssClass: 'ftc-alert-error-button ftc-modal-button'
            }],
            cssClass: 'ftc-error-color'
          });
          alert.present();
        }else{
          let alert = this.ALERTCTRL.create({
            title: message,
            buttons: [{
              text: 'Fechar',
              cssClass: 'ftc-alert-info-button ftc-modal-button'
            }],
            cssClass: 'ftc-info-color'
          });
          alert.present();
        }
      }
  }

  isEmpty(value){
    if(value == null || value == 'null' || value == '' || value == ""){
      return true;
    }else{
      return false;
    }
  }

  justNumbers(text) {
    return text.replace(/\D/g, '');
  }

  leftPad(number, pad, length) {
    let left = '';
    
    for (let index = 0; index < length; index++) {
      left += pad;
    }

    return number.length >= length ? number :  (left+number).slice(-1*length);
  }

  /*getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  

  isUserLogged(user, navCtrl) {
    if(user.isLogged){
      return true;
    }else{
      let alert = this.ALERTCTRL.create({
        title: 'Por favor, conecte-se à sua conta.',
        buttons: [{
          text: 'Cancelar',
          cssClass: 'ftc-info-color'
        }, {
          text: 'Conectar',
          cssClass: 'ftc-info-color',
          handler: () => {
            navCtrl.setRoot(LoginPage);
          },
        }],
        cssClass: 'ftc-info-color'
      });
      alert.present();
    }
  }

  removeItemArray(arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
  }

  buildListIngredients(list: any[]) {
    let ingredientsList: any[] = [];
    list.forEach(ingredient => {
      ingredientsList.push(ingredient);
    });

    return ingredientsList;
  }

  buildStringIngredients(list: any[]) {
    let ingredientsString: string = ''
    list.forEach(ingredient => {
      ingredientsString += ingredient+'\n';
    });

    return ingredientsString;
  }

  buildListCategories(list: any[]) {
    let categoriesList: any[] = [];
    list.forEach(category => {
      categoriesList.push(category);
    });

    return categoriesList;
  }

  buildStringCategories(list: any[]) {
    let _class = this;
    let categoriesString: string = ''
    let cont: number = 0;
    //sort array by code
    _.sortBy(list, [function(item) { return item; }]).forEach(code => {
        //get category's name by the code
        let category = _.find(_class.categories.list, function(item) { return item.code == code; });
        categoriesString += category.name;
        if(cont < list.length - 1){
          categoriesString += ', ';
          cont++;
        }
    });

    return categoriesString;
  }

  getFieldTimeInMinutes(time: string[]) : number {
    let fieldValueTimeHour: number = 0;
    let fieldValueTimeMinute: number = 0;
    if(time.length == 5) {
      fieldValueTimeHour = parseInt(time[0]);
      fieldValueTimeMinute = parseInt(time[3]);
    } else if(time.length == 2) {
      if(time[1] == 'hora' || time[1] == 'horas') {
        fieldValueTimeHour = parseInt(time[0]);
        fieldValueTimeMinute = 0;
      } else{
        fieldValueTimeHour = 0;
        fieldValueTimeMinute = parseInt(time[0]);
      }
    }

    return (fieldValueTimeHour * 60) + fieldValueTimeMinute;
  }*/
}
