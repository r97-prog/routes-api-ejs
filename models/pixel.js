var mongoose = require("mongoose");

const pixelschema = new mongoose.Schema({

    fullName:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    confirmPass:{
        type:String,
    },
   image:{
       data:Buffer,
       contentType:String
   },
});

const pixel  = new mongoose.model('pixel',pixelschema);

module.exports = pixel;