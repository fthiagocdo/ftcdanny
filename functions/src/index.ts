import * as functions from 'firebase-functions';

exports.test = functions.https.onRequest((req, res) => {
  res.send("Test passed");
});

/**
 * Inicia a sessao com o PagSeguro
 */
const request = require('request');
const express = require('express');
const cors = require('cors');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/', (req: any, res: any) => {
	request.post('https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=ftcdevsolutions@gmail.com&token=6FA04552D57A40378FA1BE8E7D85ABDE', {}, 
	(error: any, response: any, body: any) => {
	  if (error) {
		//res.send("error");
		res.send(JSON.stringify(error));
		return
	  }
	  //res.send("success");
	  res.send(JSON.stringify(body));
	})
	/*request.post('https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=ftcdevsolutions@gmail.com&token=6FA04552D57A40378FA1BE8E7D85ABDE', 
		function result(err: any, httpResponse: any, body: any) {
			if (err || httpResponse.statusCode !== 200) {
				console.error('Start session error', err);
				console.error('body', body);
				res.status(httpResponse && httpResponse.statusCode || 500).send(JSON.stringify(httpResponse));
				return;
			}
			res.status(200).send(JSON.stringify(body));
		});*/
});

exports.testPost = functions.https.onRequest(app);
