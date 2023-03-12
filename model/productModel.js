const mongoose = require('mongoose')
const Review = require('./reviewModel')

const productSchema = mongoose.Schema({
    name:{
        type : String,
        required:[true, 'Please provide product name'],
        trim:true
    },
    price : {
        type : Number,
        required:[true, 'Please provide product price'],
    },
    description : {
        type : String,
        required:[true, 'Please provide product description']
    },
    image:{
        type : String,
        required:[true, 'Please provide image'],
        default : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi0.wp.com%2Fmikeyarce.com%2Fwp-content%2Fuploads%2F2021%2F09%2Fwoocommerce-placeholder.png%3Fssl%3D1&imgrefurl=https%3A%2F%2Fmikeyarce.com%2F2020%2F09%2Fadd-a-custom-placeholder-image-for-woocommerce-products%2F&tbnid=-ZGqmyG0q8fYeM&vet=12ahUKEwisrvKhjs_9AhXloScCHfgGCAIQMygBegUIARC8AQ..i&docid=KI_mHRHtcmGsHM&w=1200&h=1200&q=woocommerce%20product%20default%20image&ved=2ahUKEwisrvKhjs_9AhXloScCHfgGCAIQMygBegUIARC8AQ"
    },
    category :{
        type : String,
        required:[true, 'Please provide product category']
    },
    company : {
        type : String,
        required:[true, 'Please provide company'],
        enum:["adidas", "yeezy", "nike", "balenciaga", "yves Saint Lauren", "reebok","LG", "apple", 'samsung', "obi furnitures"]
    },
    color:{
        type : [String],
        required: true,
        default : ['#222'],
    },
    featured:{
        type : Boolean,
        deafult : false
    },
    freeShpping:{
        type : Boolean,
        default : false
    },
    inventory:{
        type: Number,
        required : [true, 'Please provide number of goods'],
        default : 1
    },
    averageRating:{
        type: Number,
        required : [true, 'Please provide product rating'],
        default : 0
    },
    numberOfReviews :{
        type: Number,
        default : 0
    },
    userId:{
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    }
},{ timestamps: true , toJSON:{virtuals : true, toObject :{virtuals : true}}})

productSchema.virtual('reviews',{
    ref : 'Review',
    // product property in review model
    localField : "_id",
    // field in the review
    foreignField : "productId",
    justOne : false  
});

const Product = mongoose.model("Product", productSchema)

module.exports = Product