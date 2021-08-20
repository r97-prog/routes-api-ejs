var express = require('express');
const pixel = require('../models/pixel');
var router = express.Router();
var pixelschema = require('../models/pixel')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

// run n server 
router.get('/registration',(req,res)=>{
  res.render('index')
});

router.get('/users',(req,res)=>{
  res.render('users')
});

router.get('/addpage',(req,res)=>{
  res.render('addpage')
});

router.get('/editpage',(req,res)=>{
  res.render('editpage')
});


router.post("/registration",async(req,res)=>{
  try {
    // console.log(req.body)
    // return
    var email = req.body.email;
    var emailCheck = await pixelschema.findOne({email:email});
    console.log(emailCheck)
    if(emailCheck){
      res.status(401).json({status:false,"message":"Email already Exists"});
    }else{
      console.log(req.body)
      let post = {
        fullName:req.body.fullName,
        email:req.body.email,
        password:req.body.password,
        confirmPass:req.body.confirmPass
      }
      let register = await pixelschema.create(post);
      res.status(200).json({status:true,'result':register})
    } 
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

router.post("/login",async(req,res)=>{
  try{
  
    var email = req.body.email;
    var password = req.body.password;
    var checkEmail = await pixelschema.findOne({email:email});
    console.log(checkEmail)
    if(checkEmail){
      if(password === (checkEmail.password)){
        res.status(200).json({status:true,'result':"ok"})
      }else{
        res.send ("invalid password")
      }
    }else {
      res.send("Invalid Email")
    }
  }catch(error){
    console.log(error)
    res.status(400).json({status:false,"message":"invalid credentials"})
  }
  });

// post route
// router.post("/addpage",async(req,res)=>{
//   try {
//     // console.log(req.body)
//     // return
//     var email = req.body.email;
//     var emailCheck = await pixelschema.findOne({email:email});
//     console.log(emailCheck)
//     if(emailCheck){
//       res.status(401).json({status:false,"message":"Email already Exists"});
//     }else{
//       console.log(req.body)
//       let post = {
//         fullName:req.body.fullName,
//         lastName:req.body.lastName,
//         email:req.body.email,
//         password:req.body.password,
//         confirmPass:req.body.confirmPass
//       }
//       let register = await pixelschema.create(post);
//       res.status(200).json({status:true,'result':register})
//     } 
//   } catch (error) {
//     console.log(error);
//     res.status(401).send(error);
//   }
// });


// edit or update 
router.put("/update/:id",(req,res)=>{
// console.log(req.params.id);
console.log(req.body);
pixel.findByIdAndUpdate({_id:req.params.id},{
  $set:{
       fullName:req.body.fullName,
        email:req.body.email,
        password:req.body.password,
        confirmPass:req.body.confirmPass
  }
}).then(result =>{
  res.status(200).json({
    updated_adduser:result
  })
}).catch(error =>{
  console.log('error');
  res.status(500).json({
    error:(error)
  })
})

});


// Delete id

router.delete('remove/:id',(req,res,next)=>{
  console.log(req.params.id);
  pixel.remove({_id:req.params.id})
  .then(result =>{
    res.status(200).json({
      message:"successfully deleted",
      deletedData:result
    })
  }).catch(err=>{
    res.status(500).json({
      error:(error)
    })
  })
})










module.exports = router;

