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
  environment: braintree.Environment.Production,
  merchantId: "pbs8385nvms4r28s",
  publicKey: "g5jf6dtv7nx3tchd",
  privateKey: "a36ece87e2e397f43cc00d7661b1e91c"
});

var gatewaySB = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "y9qrg3qv8d94vvcx",
  publicKey: "7hjjtrxwkx5wy58f",
  privateKey: "a792848fed4d835e0cce6aea639eadd6"
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
app.get("/sandbox/client_token", function (req, res) {
  gatewaySB.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

app.post("/sandbox/create", function (req, res) {
  gatewaySB.customer.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    paymentMethodNonce: req.body.nonce,
    email: req.body.email,
  }, function (err, result) {
      res.send(result);
  });
});

app.post("/sandbox/transaction", function (req, res) {
  gatewaySB.transaction.sale({
    amount: req.body.price,
    paymentMethodToken: req.body.paymentMethodToken,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    res.send(result);
  });
});


app.post("/sandbox/customer", function (req, res) {
  gatewaySB.customer.find(req.body.braintreeId, function(err, customer) {
    res.send(customer);
  });
});


app.post("/sandbox/paymentmethod", function (req, res) {
  gatewaySB.paymentMethod.create({
    customerId: req.body.braintreeId,
    paymentMethodNonce: req.body.nonce
  }, function (err, result) { 
      res.send(result);
  });
});


//Live
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