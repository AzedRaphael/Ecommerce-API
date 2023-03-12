const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"1d"})
}
const isTokenValid = ({token})=>jwt.verify(token, process.env.JWT_SECRET)

const hashToken = (token)=>{
    return crypto.createHash("sha256").update(token.toString()).digest("hex");
}

const attachCookiesToResponse = ({tokenUser, res})=>{
   return  res.cookie('token', tokenUser,{
        httpOnly:true,
        expires:new Date(Date.now() + 1000 * 86400),
        secure: process.env.NODE_ENV === "production",
        signed:true
    });
}

module.exports = {generateToken, hashToken, isTokenValid, attachCookiesToResponse}