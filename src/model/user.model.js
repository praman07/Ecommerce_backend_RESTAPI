const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
// Swapped Regex for the 'validator' package to enforce production-ready email verification
// and to experiment and learning new things 
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true ,"Name field is required"],
        minlength:[2 ,"Name must be at least 2 characters long"],
        maxlength:[50 ,"Name cannot exceed 50 characters"],
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:[true,"Email field is required"],
        validate:[validator.isEmail , "Please enter correct email address"]
        //no minlength or maxlength because validator package handles it  
    },
    mobile:{
        type:String,
        required:[true,"Mobile field is required"],
        trim:true,
        validate:[(value) => validator.isMobilePhone(value , "any" , {strictMode:true}) ,
            "Please provide a valid international phone number"
        ]
    },
    password: {
    type: String,
    required: [true, "Password field is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false // act as .select('-password')
  }
},{
    timestamps:true
})


//hashing password with 10 salt rounds
userSchema.pre("save" , function(){
    return this.password = bcrypt.hashSync(this.password , 10)
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password , this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({id:this._id} , process.env.ACCESS_TOKEN_SECRET , {expiresIn:"15m"});
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({id:this._id}, process.env.REFRESH_TOKEN_SECRET , {expiresIn:"7d"});
}

const User = mongoose.model('User',userSchema); //User automatically becomes user lowercased by mongodb /mongoose
module.exports = User;