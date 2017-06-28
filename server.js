//Import all our dependencies
var express = require('express');
var app = express();
var server = require('http').Server(app);
var braintree = require("braintree");
var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "y9qrg3qv8d94vvcx",
  publicKey: "3kryw2vftgqgv6sf",
  privateKey: "b0daaf79a3dc6c90c7dbe3398bc565e8"
});

//Allow CORS
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

//generate token
app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

app.post("/create", function (req, res) {
  gateway.customer.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    paymentMethodNonce: req.body.nonce,
    email: req.body.email,
  }, function (err, result) {
      res.send(result);
  });
});

app.post("/transaction", function (req, res) {
  gateway.transaction.sale({
    amount: req.body.price,
    paymentMethodToken: req.body.paymentMethodToken,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    res.send(result);
  });
});


app.post("/customer", function (req, res) {
  gateway.customer.find(req.body.braintreeId, function(err, customer) {
    res.send(customer);
  });
});


app.post("/paymentmethod", function (req, res) {
  gateway.paymentMethod.create({
    customerId: req.body.braintreeId,
    paymentMethodNonce: req.body.nonce
  }, function (err, result) { 
      res.send(result);
  });
});


server.listen(8082);
console.log('Braintree API listening to 8082');