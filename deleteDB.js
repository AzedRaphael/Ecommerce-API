require('dotenv').config()
const connectDB = require('./db/connect');
const Review = require('./model/reviewModel');
const Product = require('./model/productModel')
const Order = require('./model/orderModel')
const User = require('./model/userModel')


// const jsonProducts = require('./products.json');

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URL);
        await User.deleteMany();
        console.log("delete successful!!!")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
};
start()