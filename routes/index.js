var express = require('express');
const pixel = require('../models/pixel');
var router = express.Router();
var pixelschema = require('../models/pixel')
const crypto = require('crypto');
// const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post("/login",async(req,res)=>{
  try{
  
    var email = req.body.email;
    var password = req.body.password;
    var checkEmail = await pixelschema.findOne({email:email});
    console.log(checkEmail)
    if(checkEmail){
      if(password === decrypt(checkEmail.password)){
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

// run n server 
router.get('/registration',(req,res)=>{
  res.render('index')
});

router.post("/registration",async(req,res)=>{
  try {
    // console.log(req.body)
    // return
    var email = req.body.email;
    var emailCheck = await pixelschema.findOne({email:email});
    if(emailCheck){
      res.status(401).json({status:false,"message":"Email already Exists"});
    }else{
      let post = {
        fullName:req.body.fullName,
        email:req.body.email,
        password:encrypt(req.body.password)
      }
      // console.log("encrypt:",encrypt)
      let register = await pixelschema.create(post);
      res.status(200).json({status:true,'result':register})
    } 
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

router.get('/users',async(req,res)=>{
  await pixelschema.find(function(err,pixelschema){
    if(err){
      console.log(err);
    }else{
      console.log(pixelschema);
      res.render('users',{'pixelschema':pixelschema});
    }
  });
});

router.get('/editpage/:id',async(req,res)=>{
  await pixelschema.findById(req.params.id).then(pixelschema =>{
      res.render('editpage',{'pixelschema':pixelschema});
  }).catch(err =>{
    console.log(err)
  })
});

// update record using POST Method
router.post('/editpage/:id',(req,res)=>{
  const mybodydata = {
    fullName:req.body.fullName,
    password:req.body.password,
  }
  pixelschema.findByIdAndUpdate(req.params.id,mybodydata,function(err){
    if(err){
      res.redirect('users'+ req.params.id);
    }else{
      res.redirect('addpage')
      console.log('users')
    }
  });
});

//get user 
router.get('/adduser',(req,res)=>{
  res.render('addUser')
});

// add user 
router.post('/adduser',async (req,res)=>{
  // console.log("Myid is : " + req.params.id);
  console.log(req.body);

  const mybodydata = {
    fullName:req.body.fullName,
    email:req.body.email,
    password:encrypt(req.body.password),
    confirmPass:encrypt(req.body.confirmPass)
      }
  console.log(mybodydata)
  
  let register = await pixelschema.create(mybodydata);
      res.status(200).json({status:true,'result':register})
    
  });


// Delete id
// router.delete('delete/:id',(req,res,next)=>{
//   console.log(req.params.id);
//   pixel.remove({_id:req.params.id})
//   .then(result =>{
//     res.status(200).json({
//       message:"successfully deleted",
//       deletedData:result
//     })
//   }).catch(err=>{
//     res.status(500).json({
//       error:(error)
//     })
//   })
// })

function encrypt(password){
  const cipher = crypto.createCipher('aes192','a password');
  var encrypted = cipher.update(password,'utf8','hex');
  encrypted += cipher.final('hex');
  return encrypted
}

function decrypt(password){
  const decipher = crypto.createDecipher('aes192','a password');
  decrypted = decipher.update(password,'hex','utf8');
  decrypted += decipher.final('utf8');
  console.log("decrypted:",decrypted);
  return decrypted
}

module.exports = router;

