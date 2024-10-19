const mongoose = require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const {UnauthenticatedError} = require('../errors')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name must be provided'],
        minlength:3,
        maxlength:20
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide valid email']   ,
        unique:true 
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6,
    }
})


//Before setting up the model , we use middleware
UserSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10)
    //generating random bytes.argument is the number of rounds which implies how many random bytes we will get
    //this refers to the document. So before we save the document , what we want is to hash the password
    this.password=await bcrypt.hash(this.password,salt)
    // console.log(this) jo kucch bhi ham create krne ke liye pass karenge uska access is this object me mil jaega
    next()
//If we use async await , we need not even use the next in argument and calling it
})
//we dont use arrow function as a callback but the normal function keyword because it is scoped to the document and that enables us to use the keyword 'this'


//Any user thats created inside the collection has access to the functions created below
UserSchema.methods.createJWT=function(){
    return jwt.sign({userID:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword= async function(candidatePassword){
    const isMatch = bcrypt.compare(candidatePassword,this.password)
    return isMatch
}

// In regular functions the this keyword represented the object that called the function, which could be the window, the document, a button or whatever
// with arrow functions there are no binding of this.
// With arrow functions the this keyword always represents the object that defined the arrow function


module.exports=mongoose.model('user',UserSchema)

//unique creates a unique index.Technically,its not a validator(and that becomes important when we run validate method manually , which we haven't done)

//Validation with mongoose gives us a better freedom to send back nice error responses instead of long error objects.




//Concepts Learned:
//Hashing Password , Setting up the mongoose middleware , instance methods on a schema



//To get a better JWT secret , go for allkeysgenerator , encryption for 256 bit