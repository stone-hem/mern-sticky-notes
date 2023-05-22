const rateLimit=require('express-rate-limit')
const {LogEvents}=require('./logger')


const loginLimiter=rateLimit({
    windowMs:60*1000,// a minute
    max:5,//each ip 5 per window per minute
    message:{message:"Too many login attempts, try after a minute"},
    handler:(req,res,next,options)=>{
        LogEvents(`Request timeout: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders:true,
    legacyHeaders:false
})

module.exports=loginLimiter