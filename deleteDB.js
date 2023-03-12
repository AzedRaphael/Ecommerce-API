require('dotenv').config()
const connectDB = require('./db/connect');
const Review = require('./model/reviewModel');
const Product = require('./model/productModel')


// const jsonProducts = require('./products.json');

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URL);
        await Review.deleteMany();
        console.log("delete successful!!!")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
};
start()