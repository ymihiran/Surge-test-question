const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/user.model.js');


const cookieExtractor = req =>{ //once we authenticated set a cookie on browser
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
}

// authorization - trigger when we sign in
passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtractor,
    secretOrKey : "ecobin" // to verify the token is legitimate
},(payload,done)=>{
    User.findById({_id : payload.sub},(err,user)=>{
        if(err)
            return done(err,false);
        if(user)
            return done(null,user);
        else
            return done(null,false);
    });
}));

//authentication local strategy using username and password
passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username},(err,user)=>{
        //error in the database
        if(err)
            return done(err);
        //if no user exist in the database
        if(!user)
            return done(null,false)
        //check the password is correct or not
        user.comparePassword(password,done);
    });
}));