const User = require('../models/User')
const {StatusCodes}=  require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register=async(req,res)=>{
    // const userDuplicate= {...req.body}
//We can do error checking in the controller as well.We are validating with mongoose to elaborate how to send more meaningful messages with mongoose
//Checking Error in the controller
// const {name,email,password} = req.body
// if(!user || !email || !password) {
//     throw new BadRequestError('Please provide all the values')
// }
//if user does not provide email , password or email , we ought to check it ourselves
    
    const user = await User.create({...req.body})
    //jo kucch bhi User.create() me pass kiya uska access pre middleware ko mil gya

    const token=user.createJWT()
    res.status(StatusCodes.CREATED).json({token,user:{name:user.name}})
//token to frontEnd ko bhejna hi hai.uske alaawa kya information bhejni hai wo depend karegi tumhaare frontEnd par
}

const login=async(req,res)=>{
    const {email , password} = req.body
    if(!email || !password) throw new BadRequestError('Please provide email and password')
    //We will set up the initial checking in the controller itself .
    //if we dont set it , ofc if there is no email , we will get back the mongoose error.But if we provide email and no password,then we get an error with no message (Check it yourself).This is the error thrown by bcrypt for not providing the candidatePasssword.Alternatively , we can set up the validation layer 

    const user = await User.findOne({email})
    if (!user) throw new UnauthenticatedError('Invalid Credentials')

    const isPasswordCorrect = await user.comparePassword(password)
    //The reason we use await keyword is because comparePassword function is asynchronous
    if (!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({token,name:user.name})
}

module.exports={login,register}

//Hashing passwords is generating random bytes and combining them with the password before we pass it through the hash function.Hash function maps data of any size to a bit string of fixed size.Hashing is a one-way phenomenon

//Mongoose Pre-Middleware of the type schema.pre('save',callback) are run before the document is saved.Callback has a parameter next for moving on to the next middleware.In the callback we can access properties to the document .Note we can also do the same stuff with async/await

//Schema instance methods: Instances of Models are documents. Documents have many of their own built-in instance methods. We may also define our own custom document instance methods.
  //Every document we create can have functions on them(pre-defined or custom)
  //Way to define functions:
      //SchemaName.methods.functionName=()=>{}