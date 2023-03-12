require('dotenv').config()
const express = require('express')
const app = express()
const productsRoute = require('./routes/products')
const usersRoute = require('./routes/users');
const reviewsRoute = require('./routes/review');
const orderRoute = require('./routes/orders') 
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./db/connect');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limiter');
const helmet = require('helmet');
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
app.set("trust proxy ", 1 )
app.use(rateLimiter({
    windowMs : 15 * 60 * 1000,
    max : 60
}));

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use(express.static('./public/frontend'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true
}))
app.use(cors({
    origin: ["*"],
    credentials:true
}))


app.use('/api/v1/products', productsRoute);
app.use('/api/v1/user', usersRoute);
app.use('/api/v1/reviews', reviewsRoute);
app.use('/api/v1/order', orderRoute);

app.use(notFound)
app.use(errorHandler);

const port = process.env.PORT
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=>console.log(`Server is listening on PORT ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()