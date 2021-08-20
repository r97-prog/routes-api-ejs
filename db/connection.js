const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://rishabh:gorzR3libdIegmmh@cluster0.cvk4k.mongodb.net/rishabh",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("connection succesfully")
}).catch((error)=>{
console.log("connection error")
});

module.exports = mongoose;
