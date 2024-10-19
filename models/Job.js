const { required } = require('joi')
const mongoose=require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please provide company names'],
        maxlength:50
    },
    job:{
        type:String,
        required:[true,'Please provide job name'],
        maxlength:100
    },
    status:{
        type:String,
        enum:{
            values:['interview','declined','pending']
            // message:'{VALUE} is not supported'
        },
        default:'pending'
    },
    createdBy:{//Using this property we tie our job model to our user model
        type:mongoose.Types.ObjectId,
//ObjectId is one of the mongoose data types and must be associated with some document of a model
        ref:'User',
//ref => which model we are referencing 
        required:[true,'Please provide User ID']
    }
},{timestamps:true})

//timestamps:true creates by default two more properties which are createdAt and updatedAt.These properties are also useful for filtering purposes


module.exports=mongoose.model('Job',JobSchema)