const mongoose = require('mongoose');

var buonoSchema = new mongoose.Schema({
    utente: String,
    dataora: String,
    datautilizzo: Date,
    tipo: String
})

module.exports = mongoose.model('Buoni', buonoSchema)