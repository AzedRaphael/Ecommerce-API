const checkPermission = (reqUser, resourceUser)=>{
    if(reqUser.role === "admin")return;
    if(reqUser.user._id.toString() === resourceUser.toString()) return;
    res.status(400)
    throw new Error('Unathorized to access this route') 
}

module.exports = checkPermission