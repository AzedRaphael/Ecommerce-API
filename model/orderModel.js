const mongoose = require('mongoose');

const singleOrderItem = mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    image:{
        type : String,
        required : true
    },
    price:{
        type : Number,
        required : true
    },
    quantity:{
        type : Number,
        required : true
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "Product"
    }
})

const orderSchema = mongoose.Schema({
    tax:{
        type : Number,
        required : true
    },
    shippingFee : {
        type : Number,
        required : true
    },
    subtotal:{
        type : Number,
        required : true
    },
    total:{
        type : Number,
        required : true
    },
    status:{
        type : String,
        enum : ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default :'pending'
    },
    clientSecret : {
        type : String,
        required : true
    },
    paymentId : {
        type : String
    },
    cartItems : [singleOrderItem],
    userId: {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    }
},{ timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order