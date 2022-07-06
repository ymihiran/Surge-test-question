const express = require('express');
const userRouter = require("express").Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
let User = require("../models/user.model.js");
const { findById } = require('../models/user.model.js');
const { sendMail } = require('../controller/SendMail');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const sendMailTransport = require ('nodemailer/lib/sendmail-transport');





//Add user details
userRouter.post('/',(req,res)=>{
  const { firstName,lastName,email,dateOfBirth,mobile,status,password,accountType} = req.body;
  
  User.findOne({email},(err,user)=>{
      if(err)
          res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
      if(user)
          res.status(400).json({message : {msgBody : "Email is already taken", msgError: true}});
      else{
          const newUser = new User({firstName,lastName,email,dateOfBirth,mobile,status,password,accountType});

          if(!status){
            sendMail(firstName,password,email,process.env.CLIENT_URL+'/login');
          }
          
          newUser.save(err=>{
              if(err)
                  res.status(500).json({message : {msgBody : "Error has occured : Save failed", msgError: true}});
              else
                  res.status(201).json({message : {msgBody : "Account successfully created", msgError: false}});
          });
      }
  });
});

//Display user details
userRouter.get("/",auth,authAdmin,(req, res) => {
  User.find().exec((err,users) =>{
    if(err){
      return res.status(400).json({
        error:err
      });
    }
    return res.status(200).json({
      success:true,
      existingUsers:users
    });
  });
});

userRouter.get('/users', async (req, res) => {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  let previous,next,count;

  async function countDoc(){
    count = await User.countDocuments().exec()
  }

  await countDoc();

  const totalPages = Math.ceil(count / limit);

  
  

  if (endIndex < count) {
    next = {
      page: page + 1,
      limit: limit
    }
  }
  
  if (startIndex > 0) {
    previous = {
      page: page - 1,
      limit: limit
    }
  }

  User.find().limit(limit).skip(startIndex).exec((err,users) =>{
    if(err){
      return res.status(400).json({
        error:err
      });
    }
    return res.status(200).json({
      success:true,
      existingUsers:users,
      prev:previous,
      next:next,
      pages:totalPages
    });
  });

});

//Display specific user details
userRouter.get(`/:id`,(req, res) => {

  let postId = req.params.id;

  User.findById(postId,(err,users) =>{
    if(err){
      return res.status(400).json({success:false, err})
    }
    return res.status(200).json({
      success:true, 
      users
      });
  });

});

//update user details
userRouter.put('/:id',(req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set:req.body
    },
    (err,users)=>{
      if(err){
        return res.status(400).json({error:err});
      }

      return res.status(200).json({
        success:"updated successfully"
      });
    }
  );
});

//Delete student

userRouter.delete('/:id',(req, res) => {
  User.findByIdAndRemove(req.params.id).exec((err,deleteuser) =>{

      if(err) return res.status(400).json({
        message:"Delete Unsuccessfull",err
      });

      return res.json({
        message:"Delete Successfull",deleteuser
      });
  });
});

//login
userRouter.post('/login', async (req, res, next) => {
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user)
    return res.status(400).json({message : {msgBody : "Email is not registered", msgError: true}});
  
  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch)
    return res.status(400).json({message : {msgBody : "Invalid Password", msgError: true}});

  const refresh_token = JWT.sign({_id:user._id},process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: "7d",
  });
  
  res.cookie('refreshtoken',refresh_token,{httpOnly:true,path:'user/refresh_token/',maxAge:30*24*60*60*1000});

  res.json({msg: "Login Successfull",user,refresh_token});
});

userRouter.post('/refresh_token',(req,res)=>{

  try{
    const rf_token = req.cookies.refreshtoken;
    if(!rf_token)
    return res.json({success:false,err:"Please login again"});
      JWT.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
    if(err)
      return res.json({success:false,err:"Invalid refresh token"});
    const access_token = JWT.sign({_id:user._id},process.env.ACCESS_TOKEN_SECRET);
    res.json({success:true,access_token});
  });
  }catch(err){
    res.json({success:false,err});
  }
 
});

// userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{
//   if(req.isAuthenticated()){
//      const {_id,username,name,phone,email,nic,gender,role} = req.user;
//      const token = signToken(_id);
//      res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
//      res.status(200).json({isAuthenticated : true,user : {_id,username,name,phone,email,nic,gender,role}});
//   }
// });

userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
  res.clearCookie('access_token');
  res.json({user:{username : "", role : ""},success : true});
});


userRouter.get('/admin',passport.authenticate('jwt',{session : false}),(req,res)=>{
  if(req.user.role === 'admin'){
      res.status(200).json({message : {msgBody : 'You are an admin', msgError : false}});
  }
  else
      res.status(403).json({message : {msgBody : "You're not an admin,go away", msgError : true}});
});


userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
  const {_id,username,name,phone,email,nic,gender,role} = req.user;
  res.status(200).json({isAuthenticated : true, user : {_id,username,name,phone,email,nic,gender,role}});
});

//Pagination code

function paginatedResults(model,startIndex,endIndex) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

  
    const results = {}


    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

module.exports = userRouter;
