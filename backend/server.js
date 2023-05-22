require('dotenv').config()
const express= require('express')
const res = require('express/lib/response')
const path=require('path')
const app=express()
const {logger}=require('./middleware/logger')
const errorHandler=require('./middleware/errorHandler')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const corsOptions=require('./config/corsOptions')
const connectDB=require('./config/dbConnection')
const mongoose=require('mongoose')
const {LogEvents}=require('./middleware/logger')
const PORT=process.env.PORT||3500

console.log(process.env.NODE_ENV)

connectDB()

//middleware
//log middleware
app.use(logger)
//cors middleware to allow accessible to public
app.use(cors(corsOptions))
//add middleware ability to process json
app.use(express.json())
//third party middleware for cookies
app.use(cookieParser())

//tells our server where to get the static files
app.use('/',express.static(path.join(__dirname,'public')))

//create routers
app.use('/',require('./routes/root'))
app.use('/auth',require('./routes/authRoutes'))
app.use('/users',require('./routes/userRoutes'))
app.use('/notes',require('./routes/noteRoutes'))


app.all('*',(req, res)=>{
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message:"Resource not available"})
    }else{
        res.type('txt').send('Resource not available')
    }
})

app.use(errorHandler)

    // app.listen(PORT,()=>console.log(`Server Running on Port http://localhost:${PORT}`))
mongoose.connection.once('open',()=>{
    console.log('connected to MongoDB ...')
    app.listen(PORT,()=>console.log(`Server Running on Port http://localhost:${PORT}`))
})

mongoose.connection.on('error',err=>{
    console.log(err)
    LogEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log')
})