var express = require('express');
const pixel = require('../models/pixel');
var router = express.Router();
var pixelschema = require('../models/pixel')
const crypto = require('crypto');
const multer = require('multer');
var path = require('path');
const session = require('express-session');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

// Profile routing Home Page
router.get('/Home',(req,res)=>{
  res.render('Home');
});

// logout routes
router.get('/logout',(req,res)=>{
  req.session.destroy((err)=>{
   if(err){
     return console.log(err);
   }
   res.redirect('/');
 });
});

// set storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    let filename = file.originalname.split('.')[0] +'-'+Date.now() + path.extname(file.originalname)
    console.log("filename : ",filename);
    cb(null,filename);
  }
});

const upload = multer({ storage: storage })

// login route
router.post("/login",async(req,res)=>{
  try{
    var email = req.body.email;
    var password = req.body.password;
    var checkEmail = await pixelschema.findOne({email:email});
    // console.log(checkEmail)
    if(checkEmail){
      if(password === decrypt(checkEmail.password)){
        req.session.Id = checkEmail._id;
        res.status(200).json({status:true,'result':"ok"})
      }else{
        res.send ("invalid password")
      }
    }else {
      res.send("Invalid Email")
    }
  }catch(error){
    console.log(error)
    res.status(401).json({status:false,"message":"invalid credentials"})
  }
});

// run on server 
router.get('/registration',(req,res)=>{
  res.render('index')
});

// registaration data post
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
      let register = await pixelschema.create(post);
      res.status(200).json({status:true,'result':register})
    } 
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

// user table 
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

// edituser find by id
router.get('/editpage/:id',(req,res)=>{
  pixelschema.findById(req.params.id).then(pixelschema =>{
      res.render('editpage',{'pixelschema':pixelschema});
  }).catch(err =>{
    console.log(err)
  })
});

// update record using POST Method findIdAndUpdate
router.post('/editpage/:id',async(req,res)=>{
  const mybodydata = {
    fullName:req.body.fullName,
    password:encrypt(req.body.password)
  }
  await pixelschema.findByIdAndUpdate(req.params.id,mybodydata)
  .then(result => {
    res.status(200).json({status:true,'result':result})  
  }).catch(err => {
    res.status(401).json({status:false,'error':err})  
  })
});

//get user 
router.get('/adduser',(req,res)=>{
  res.render('addUser')
});

// addUsers
router.post("/adduser",async(req,res)=>{
  try {
    var email = req.body.email;
    var emailCheck = await pixelschema.findOne({email:email});
    if(emailCheck){
      res.status(401).json({status:false,"message":"Email already Exists"});
      console.log("Email already exists")
    }else{
      let mybodydata = {
        fullName:req.body.fullName,
        email:req.body.email,
        password:encrypt(req.body.password)
      }
      let register = await pixelschema.create(mybodydata);
      res.status(200).json({status:true,'result':register})
    } 
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

// Delete id
router.delete('/delete/:id',async(req,res)=>{
  console.log(req.params.id);
  await pixelschema.remove({_id:req.params.id})
  .then(result =>{
    res.status(200).json({status:true,'message':'data deleted successfully.'})
  }).catch(err=>{
    res.status(500).json({
      error:(error)
    })
  })
});

// get image 
router.get('/profile',async (req, res) => {
  if(req.session.Id) {
    await pixelschema.find({_id:req.session.Id}).then((result) => {  
      res.render('profile',{'result': result[0]});
    }).catch(err => {
      res.status(500).send('An error occurred', err);
    });
  } else {
    res.redirect("/"); 
  }
});

router.post('/profile',upload.single('profile'),async(req,res)=>{
  let userdata = {
    fullName:req.body.fullName,
  }

  if(req.body.password) {
    userdata['password'] = req.body.password
  }

  if(req.file) {
    userdata['profile_image'] = req.file.filename
  }
  await pixelschema.updateOne({_id:req.session.Id},userdata)
  .then(result => {
    res.status(200).json({status:true,'result':result})  
  }).catch(err => {
    res.status(401).json({status:false,'error':err})  
  })
});

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
  // console.log("decrypted:",decrypted);
  return decrypted
}

module.exports = router;

