const {CustomAPIError} = require("./custom-error")

const errorHandler = (err, req,res,next)=>{
    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json(err.message)
    }
    return res.status(500).json({
        msg:err.message,
        stack:process.env.NODE_ENV === 'development' ? err.stack : null
    })
}
module.exports = errorHandler