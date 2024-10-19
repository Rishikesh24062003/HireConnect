const mongoose=require('mongoose')

const connectDB=async (connectURL)=>{
  return mongoose.connect(connectURL)
}

module.exports=connectDB