var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepenseSchema = new Schema({
   idGroupe:String,
   name: String,
   fromUser:String, 
   toUser:String,
   montant:Number
});

module.exports = mongoose.model('Depense', DepenseSchema);