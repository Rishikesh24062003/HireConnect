const jwt= require("jsonwebtoken")
const User=require('../models/User')
const { UnauthenticatedError } = require("../errors")

const authenticationMiddleware=async (req,res,next)=>{
    const data = req.headers.authorization
    if (!data || !(data.startsWith('Bearer '))){
        throw new UnauthenticatedError('Token Not Provided')
    }
    try {
        const token = data.split(' ')[1]
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        //attaching the user to the job route
        req.user={userID:payload.userID}
    
//Usually after the verification is done , we are only looking for the userID to be send along so that in the next middleware , we can find out the resources belonging to the user
//Also , it makes sense to give more meaningful names like userID etc so that there is clarity overall

//Alternatively what we could have done is 
        // const user =await User.findOne({_id:payload.UserID}).select('-password')
        // req.user=user
//we dont implement this functionality because we have no way to remove the user anyway.So if we get the id from the payload(token), there is absolutely no doubt that the user exists in the database 
        next()
    } catch (error) {
        throw new UnauthenticatedError('Invaid login credentials')
    }
}

//There is a better way than sending the jwt in the authorization header everytime.More on it later


module.exports=authenticationMiddleware