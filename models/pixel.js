var mongoose = require("mongoose");

const pixelschema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    fullName:{
        type:String,
    },
    lastName:{
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
    }
});

const pixel  = new mongoose.model('pixel',pixelschema);

module.exports = pixel;