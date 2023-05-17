const {format}=require('date-fns')
const { v4:uuid}=require('uuid')
const fs=require('fs')
const fsPromises=require('fs').promises
const path=require('path')

const LogEvents = async(message, LogFileName)=>{
    //create a datetime object
    const dateTime=`${format(new Date(),'yyyymmdd\tHH:mm:ss')}`
    //create the log item
    const logItem=`${dateTime}\t${uuid()}\t${message}\n`
    try {
        //if no dir create it
        if (!fs.existsSync(path.join(__dirname,'..','logs'))) {
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',LogFileName),logItem)
    } catch (error) {
        console.log(error)
    }
}

const logger=(req, res, next)=>{
    LogEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports={LogEvents,logger}