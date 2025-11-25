const mongoose = require('mongoose');

const IncidentsSchema = new mongoose.Schema({

    type :{
        type : String,
        required : true
    },

    description :{
        type : String,
        required : true
    },

    date :{
        type : Date,
        required : true,
        default : Date.now
    },

    location :{
        type : String,
        required : true
    },

    details :{
        type : String,
        required : false
    }


})

module.exports = mongoose.model('Incidents', IncidentsSchema)