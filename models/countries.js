var mongoose = require('mongoose');

var CountrySchema = mongoose.Schema({
  country: String,
  country_code: String,
  year: String,
  month: String,
  local_price: String,
  dollar_ex: String,
  dollar_price: String,
  dollar_ppp: String,
  dollar_valuation: String
});


var Country = mongoose.model("Country", CountrySchema);

module.exports = Country;
