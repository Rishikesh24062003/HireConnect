const {CustomAPIError}=require('../errors')
const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware=(err,req,res,next)=>{
  // if (err instanceof CustomAPIError) return res.status(err.statusCode).json({msg:err.message})

  let customErrorObject={
    statusCode:err.statusCode||StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message||'Something went wrong , Please try again'
  }
  //setting default values.Eventually we have multiple if statements to manipulate its properties

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
  return res.status(customErrorObject.statusCode).json({msg:customErrorObject.msg})
}

module.exports=errorHandlerMiddleware

//ToDo-> What if we throw error inside the errorHandler itself.There aint a middleware in the stack for that 




//Validation error if user doesnt provide one of the values 
//Duplicate issue coz email is unique
//Cast error when id doesnt match the pattern that mongoose expects

//Two ways to deal with code:create a customErrorObject and set up multiple if statements and set the customErrorObject properties depending upon different ifs.Lastly return the customErrorObject in the response 