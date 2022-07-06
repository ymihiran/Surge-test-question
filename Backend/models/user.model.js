const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },

    lastName: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    dateOfBirth: {
        type: Date,

    },

    mobile: {
        type: Number,
        trim: true
    },

    status: {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: true
    },


    accountType: {
        type: String,
        default: "Student",
    }
}, {
    timestamps: true,
});

userSchema.pre('save',function(next){
    if(!this.isModified('password')) //check the password is modified or not
        return next()
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
            return next(err);
        this.password = passwordHash; //overide the existing password
        next();
    });
});

userSchema.methods.comparePassword = function(password,cb){ //compare the plaintext password with the hashed password
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return cb(err);
        else{
            if(!isMatch)
                return cb(null,isMatch);
            return cb(null,this);
        }
    });
}

const User = mongoose.model("user", userSchema);

module.exports = User;