import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { Http, RequestOptions, Headers } from '@angular/http';
import { VarGlobalProvider } from '../var-global/var-global';
import 'rxjs/add/operator/map';

declare var PagSeguroDirectPayment: any;

@Injectable()
export class PagseguroPgtoServiceProvider {

  public credencial: Credencial;
  public dados = new Dados();

  constructor(
    private http: Http, 
    private storage: Storage, 
    private datepipe: DatePipe, 
    private varGlobals: VarGlobalProvider) {

    }

  createHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getSession() {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.http.get(this.varGlobals.getUrlServiceApi()+'payments', requestOptions)
      .map(res => {
        return res.json()
      });
  }
  
  sendPaymentToServer(checkoutId, valuePayment) {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    let data = {
      dados_cpf: this.dados.cpf,
      dados_ddd: this.dados.ddd,
      dados_telefone: this.dados.telefone,
      dados_email: this.dados.email,
      dados_nascimento: this.dados.nascimento,
      dados_hashComprador: this.dados.hashComprador,
      dados_logradouro: this.dados.logradouro,
      dados_numero: this.dados.numero,
      dados_bairro: this.dados.bairro,
      dados_cep: this.dados.cep,
      dados_cidade: this.dados.cidade,
      dados_estado: this.dados.estado,
      dados_hashCard: this.dados.hashCard,
      dados_nome: this.dados.nome,
      checkout_id: checkoutId,
      value_payment: valuePayment
    };

    return this.http.post(this.varGlobals.getUrlServiceApi()+'payments', data, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  // MÉTODO QUE DISPARA OUTROS MÉTODOS NECESSÁRIOS PARA A UTILIZAÇÃO DA API DO PAGSEGURO
  init(idSession, isSandBox) : Promise<any> { 
    return new Promise((resolve) => {
      this.credencial = new Credencial();
      this.dados = new Dados();

      this.credencial.urlPagSeguroDirectPayment = this.varGlobals.getUrlPagSeguroDirectPayment();
      console.log(this.varGlobals.getUrlPagSeguroDirectPayment());
      this.credencial.key = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
      this.credencial.idSession = idSession;
      this.credencial.isSandBox = isSandBox;
      
      if (!this.varGlobals.getStatusScript()) {
        this.loadPagSeguroDirectPayment().then(() => {
          PagSeguroDirectPayment.setSessionId(this.credencial.idSession);
            this.storage.set('credencial', this.credencial);
            this.varGlobals.setStatusScript(true);
            console.log("PagSeguroDirectPayment loaded!");
            console.log(PagSeguroDirectPayment);
            resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  // CARREGA O JAVASCRIPT DO PAGSEGURO PARA NOSSA VARIÁVEL 
  loadPagSeguroDirectPayment() {  
    return new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = this.credencial.urlPagSeguroDirectPayment;
      document.head.appendChild(script);
    });
  }

  //Iniciar o processo de pagamento: pegar bandeira do cartão -> pegar número de parcelas sem juros -> criar hash do cartão de crédito
  initiatePayment() : Promise<any> { 
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.setSessionId(this.credencial.idSession);
      PagSeguroDirectPayment.getBrand({
        cardBin: this.dados.numCard,
        success: response => {
          console.log('numCard', this.dados.numCard);
          this.dados.bandCard = response.brand.name;
          console.log('Bandeira do cartão: ' + this.dados.bandCard);  

          this.createCard().then(() => {
            resolve(true);
          }, err => {
            reject(err);
          });
        }, error: response => { 
          console.log('buscaBandeira', response);
          reject(response); 
        }
      });
    });
  }

  // INICIA OS PROCESSOS PARA QUE SEJA REALIZADO O PAGAMENTO
  // AO CLICAR NO BOTÃO PAGAR
  createCard() : Promise<any>{ 
    return new Promise((resolve, reject) => {
      //BUSCA O HASH DO COMPRADOR JUNTO A API DO PAGSEGURO
      this.dados.hashComprador = PagSeguroDirectPayment.getSenderHash();
      console.log('Hash Comprador: '+this.dados.hashComprador);

      //CRIA O HASK DO CARTÃO DE CRÉDITO JUNTO A API DO PAGSEGURO
      PagSeguroDirectPayment.createCardToken({
        
        cardNumber: this.dados.numCard,
        cvv: this.dados.codSegCard,
        expirationMonth: this.dados.mesValidadeCard,
        expirationYear: this.dados.anoValidadeCard,
        brand: this.dados.bandCard,
        success: response => {
          this.dados.hashCard = response.card.token;
          console.log("Token Card: "+response.card.token);
          resolve(true);
        },
        error: response => { 
          console.log(response) 
          reject(response);
        }
      });
    });
  }
}

// CLASSE PARA ARMAZENAR NOSSOS DADOS DE ACESSO A CONTA DO PAGSEGURO
export class Credencial {
  key: string;
  urlPagSeguroDirectPayment: string;
  idSession: string;
  isSandBox: boolean;
}

// CLASSE PARA ARMAZENAR OS DADOS DA TRANSAÇÃO DE CHECKOUT NECESSÁRIOS PARA CONSUMIR A API
export class Dados {
  public id: number;
  public nome: string = '';
  public ddd: string = '';
  public telefone: string = '';
  public email: string = '';
  public cpf: string = '';
  public nascimento: string = '';
  public logradouro: string = '';
  public numero: string = '';
  public bairro: string = '';
  public cep: string = '';
  public cidade: string = '';
  public estado: string = '';
  public numCard: string = '';
  public mesValidadeCard: string = '';
  public anoValidadeCard: string = '';
  public codSegCard: string = '';
  public hashComprador: string = '';        
  public bandCard: string = '';             
  public hashCard: string = '';             
  constructor(obj?) {
    Object.assign(this, obj, {}, {});
  }

}
