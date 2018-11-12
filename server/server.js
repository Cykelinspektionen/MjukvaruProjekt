var express = require('express');
var app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Here is where I'm trying to access and log the value of "a"
app.post('/', function (req, res) {
	console.log(req.body.a);
	res.send({succes: 'It-worked-lol'});
});

app.post('/sign_up', function (req, res) {
	console.log(req.body);
	res.send({jwt: 'auth_token_1'});
});

app.post('/sign_in', function (req, res) {
	console.log(req.body);
	res.send({jwt: 'auth_token_1'});
});

app.listen(8080, function() {
  console.log('Listening on port 8080');
});