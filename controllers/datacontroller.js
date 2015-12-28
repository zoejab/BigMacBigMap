console.log('datacontroller loaded');

var mongoose = require('mongoose');
var CountryModel = require('../models/countries.js');
var CountryHelper = require('../helpers/country_helper.js');

module.exports.controller = function(app) {

  //get all countries
  app.get('/countries', function(req, res) {
      CountryModel.find().sort('Year').exec(function(err, countries) {
        if (err) return next(err);
        res.send(countries);
      });
    });

  //get by country
  	app.get('/countries/:country', function(req,res){
  	  CountryModel.find({Country: req.params.country}).sort('Year').exec(function (err, coun) {
  			if (err) return next(err);
  	    res.send(coun);
  	  });
  	});

    //get by country
      app.get('/:year', function(req,res){
        CountryModel.find({Year: req.params.year}).exec(function (err, coun) {
          if (err) return next(err);
          res.send(coun);
        });
      });

};
