//Import all our dependencies
var express = require('express');
var app = express();
var server = require('http').Server(app);

var braintree = require("braintree");

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

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});


server.listen(8082);
console.log('Braintree API listening to 8082');