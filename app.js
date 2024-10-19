require('dotenv').config()
require('express-async-errors') //equivalent of async-Wrapper Middleware of project 1

const express=require('express')
const app= express()

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit') //set it as last bcoz there is a little bit of configuration to take place

const connectDB=require('./db/connect')

const authRouter=require('./routes/auth')
const jobRouter=require('./routes/jobs')

const authenticationMiddleware=require('./middleware/authentication')
const errorHandlerMiddleware=require('./middleware/error-handler')
const notFoundMiddleware=require('./middleware/not-found')

app.set('trust proxy', 1);  //if our application is behind reverse proxy
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes //how long 
    max: 100, // limit each IP to 100 requests per windowMs  //how many
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use('/api/v1/jobs',authenticationMiddleware,jobRouter)
app.use('/api/v1/auth',authRouter)

app.get('/',(req,res)=>{
  res.send('<div><h1>This is the home page</h1><a href="">Documentation</a></div>')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const PORT = process.env.PORT || 3000
const start=async()=>{
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(PORT,()=>console.log(`Server listening on PORT ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()

//Helmet -> sets various http headers to prevent numerous possible attacks
//Cors ensures that our API is accessible from different domain

// Todo -> Helmet , Cors , xss-clean , reverse-proxy