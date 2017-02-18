var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupeSchema = new Schema({
   name: String,
   nombreUsers:Number
});

module.exports = mongoose.model('Groupe', GroupeSchema);