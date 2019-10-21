import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { Http, RequestOptions, Headers } from '@angular/http';
import { VarGlobalProvider } from '../var-global/var-global';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';
import { UtilsProvider } from '../utils/utils';
import { HttpServiceProvider } from '../http-service/http-service';
import { PreloaderProvider } from '../preloader/preloader';
import { json } from 'body-parser';

declare var PagSeguroDirectPayment: any;

@Injectable()
export class PagseguroPgtoServiceProvider {

  public credencial: Credencial;
  public dados = new Dados();

  constructor(
    private http: Http, 
    private storage: Storage, 
    private datepipe: DatePipe, 
    private varGlobais: VarGlobalProvider,
    private UTILS: UtilsProvider,
    private HTTPSERVICE: HttpServiceProvider,
    private LOADER: PreloaderProvider) {

    }

  createHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getSession() {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    return this.http.get(this.varGlobais.getUrlServiceApi()+'payments', requestOptions)
      .map(res => {
        return res.json()
      });
  }
  
  sendPaymentToServer() {
    const requestOptions = new RequestOptions({headers: this.createHeader()});

    let data = {
      dados_cpf: this.dados.cpf,
      dados_telefone: this.dados.telefone,
      dados_email: this.dados.email,
      dados_hashComprador: this.dados.hashComprador,
      dados_logradouro: this.dados.logradouro,
      dados_numero: this.dados.numero,
      dados_bairro: this.dados.bairro,
      dados_cep: this.dados.cep,
      dados_cidade: this.dados.cidade,
      dados_estado: this.dados.estado,
      dados_hashCard: this.dados.hashCard,
      dados_nome: this.dados.nome
    };

    return this.http.post(this.varGlobais.getUrlServiceApi()+'payments', data, requestOptions)
      .map(res => {
        return res.json()
      });
  }

  // MÉTODO QUE DISPARA OUTROS MÉTODOS NECESSÁRIOS PARA A UTILIZAÇÃO DA API DO PAGSEGURO
  init(idSession, isSandBox) : Promise<any> { 
    return new Promise((resolve) => {
      this.credencial = new Credencial();
      this.dados = new Dados();

      if (isSandBox) {
        this.credencial.urlPagSeguroDirectPayment = "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
      } else {
        this.credencial.urlPagSeguroDirectPayment = "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
      }

      this.credencial.key = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
      this.credencial.idSession = idSession;
      this.credencial.isSandBox = isSandBox;
      
      if (!this.varGlobais.getStatusScript()) {
        this.loadPagSeguroDirectPayment().then(() => {
          PagSeguroDirectPayment.setSessionId(this.credencial.idSession);
            this.storage.set('credencial', this.credencial);
            this.varGlobais.setStatusScript(true);
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

      //CRIA O HASK DO CARTÃO DE CRÉDITO JUNTO A API DO PAGSEGURO
      PagSeguroDirectPayment.createCardToken({
        
        cardNumber: this.dados.numCard,
        cvv: this.dados.codSegCard,
        expirationMonth: this.dados.mesValidadeCard,
        expirationYear: this.dados.anoValidadeCard,
        brand: this.dados.bandCard,
        success: response => {

          this.dados.hashCard = response.card.token;
          console.log(this.dados);
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
  public nome: string = 'Jose Comprador';
  public ddd: string = '56273440';
  public telefone: string = '56273440';
  public email: string = 'comprador@sandbox.pagseguro.com.br';
  public cpf: string = '22111944785';
  public nascimento: string = '16/09/1987';
  public logradouro: string = 'Av. Brig. Faria Lima';
  public numero: string = '1384';
  public bairro: string = 'Jardim Paulistano';
  public cep: string = '01452002';
  public cidade: string = 'Sao Paulo';
  public estado: string = 'SP';
  public numCard: string = '4012001037141112';
  public mesValidadeCard: string = '12';
  public anoValidadeCard: string = '2030';
  public codSegCard: string = '123';
  public hashComprador: string;        // preenchido dinamicamente
  public bandCard: string;             // preenchido dinamicamente
  public hashCard: string;             // preenchido dinamicamente
  public parcelas: Array<Object> = []; // preenchido dinamicamente
  constructor(obj?) {
    Object.assign(this, obj, {}, {});
  }

}
