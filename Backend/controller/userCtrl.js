const User = require("../models/users.model");
const nanoid  = require("nanoid");
const {sendMail} = require("./sendMail.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create user to the system
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, accountType } = req.body;
    console.log(req.body);

    //Generate random password with 8 characters
    const temPassword = nanoid(8);

    if (!firstName || !lastName || !email || !accountType) {
      return res.status(400).json({
        msg: "Please fill all the fields",
      });
    }
    //Check if email is valid
    if (!validateEmail(email)) {
      return res.status(400).json({
        msg: "Please enter valid email",
      });
    }

    //Check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    //Hash password
    const temPasswordHash = await bcrypt.hash(temPassword, 12);

    //Create new user
    await User.create({
      firstName,
      lastName,
      email,
      accountType,
      password: temPasswordHash,
    }).then((data) => {
      res.status(200).json(data);

      const url = `${process.env.CLIENT_URL}/login`;

      //Send temporary password and login url to user email
      sendMail(firstName, temPassword, email, url);
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

//Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "Please fill all the fields",
      });
    }

    //Check if email already exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "User does not exist",
      });
    }
    //Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Password is incorrect",
      });
    }

    //refresh token
    const refresh_token = createRefreshToken({ id: user._id });

    res.cookie('refreshtoken',refresh_token,{httpOnly:true,path:'user/refresh_token/',maxAge:30*24*60*60*1000});

    return res.status(200).json({
      msg: "Login Success",
      data: user,
      token: refresh_token
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

//Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check password length
    if (password.length < 8) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long",
      });
    }
    //Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    //Update password
    await User.findOneAndUpdate({ email }, { password: passwordHash }).then(
      () => {
        res.status(200).json({
          msg: "Password reset successfully",
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

//Register user
const registerUser = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
  User.findByIdAndRemove(req.params.id).exec((err,deleteuser) =>{

    if(err) return res.status(400).json({
      message:"Delete Unsuccessfull",err
    });

    return res.json({
      message:"Delete Successfull",deleteuser
    });
});
};


const updateUser = async (req, res) => {
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
};

//Get all users
const getAllUsersInfo = async (req, res) => {
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

};

//Get user information
const getUserInfo = async (req, res) => {
  console.log("getUserInfo", req.user);
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Logout user
const logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
    return res.json({ msg: "Logged out." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Check if email is valid format
function validateEmail(email) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(email);
}

//Create refresh token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

//get access token
const getAccessToken = (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Please login now!" });

      const access_token = createAccessToken({ id: user.id });
      console.log(user);
      res.json({ access_token });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

//Create access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "50m",
  });
};

module.exports = {createUser, login, resetPassword, registerUser,updateUser, getAllUsersInfo, getUserInfo, logout, getAccessToken,deleteUser};