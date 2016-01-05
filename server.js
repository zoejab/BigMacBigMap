var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	CountryModel = require('./models/countries.js'),
	app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + "/bower_components"));

//Connect to mongodb
mongoose.connect('mongodb://localhost/BigMac', function (err) {
  if(err){
    console.log(err);
  }else {
    console.log('connection successful');
  }
});

//Set up the port to listen
app.listen(80, function () {
  console.log('App listening on port 8080...');
});

// Controllers
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});
