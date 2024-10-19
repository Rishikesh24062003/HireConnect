const {StatusCodes}=require('http-status-codes')
const Job= require('../models/Job')
const{BadRequestError,NotFoundError} = require('../errors/')
const { default: mongoose } = require('mongoose')

const getAllJobs=async(req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userID}).sort('-createdAt')
    res.status(StatusCodes.OK).send({jobs , count:jobs.length})
}

const createJob=async(req,res)=>{
    req.body.createdBy=req.user.userID
    const job = await Job.create({...req.body})
    res.status(StatusCodes.CREATED).json(job)
}

const getJob=async(req,res)=>{
    const {user:{userID},params:{id:jobID}} = req
//Nested Destructuring -> first part extracts userID property from the req.user and second part extracts id(as jobID) from req.params 
    const job = await Job.findOne({
        _id:jobID,
        createdBy:userID
    })
    if (!job) throw new NotFoundError(`No job with ID ${jobID}`)
    // Two types of errors possible , one where syntax doesnt match that of mongoose objectID and second when the requested id doesnt exist
    res.status(StatusCodes.OK).json({job})
}

const updateJob=async(req,res)=>{
    const {
        user:{userID},
        params:{id:jobID},
        body:{company,position}
    }=req

    // ToDo : What if company or position field is undefined instead of being vacant 
    if (company==='' || position==='') throw new BadRequestError('Company and Position fields cannot be empty')  
    //Error Checking in the controller itself 
    const job = await Job.findOneAndUpdate(
        {
            _id:jobID,
            createdBy:userID
        },
        req.body,
        {
            runValidators:true,
            new:true
        }
    )
    if (!job) throw new NotFoundError(`No job with ID ${jobID}`)
    res.status(StatusCodes.OK).json({job})
}

const deleteJob=async(req,res)=>{
    const {
        user:{userID},
        params:{id:jobID}
    } = req
    const job = await Job.findOneAndRemove({_id:jobID,createdBy:userID})
    if (!job) throw new NotFoundError(`No job with ID ${jobID}`)
    res.status(StatusCodes.OK).send()
}

module.exports={
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob
}