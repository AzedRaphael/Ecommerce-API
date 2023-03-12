const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required:[true, 'Please provide name'],
        minlength : 4,
        maxlength : 25
    },
    email:{
        type:String,
        required : [true, 'Please provide an email'],
        trim:true,
        unique: true,
        validate : {
            validator : validator.isEmail,
            message : "Please provide valid email"
        }
    },
    password:{
        type:String,
        required : [true, 'Please add your password'],
        minlength : 6
    },
    role :{
        type : String,
        enum :["admin", "user"],
        default : "user"
    },    
    userAgent:{
        type:Array,
        default: [],
        required:true
    }
},{ timestamps: true });

// Encrypt password before saving to DB
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }else{
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPWD = await bcrypt.hash(this.password, salt);
        this.password = hashedPWD
        next()
    }
});
const User = mongoose.model('User', userSchema)

module.exports = User