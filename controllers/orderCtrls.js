const asyncHandlers = require('express-async-handler');
const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const checkPermission = require('../middleware/checkPermission')

const createOrder = asyncHandlers(async(req,res)=>{
    const {items: cartItems, tax, shippingFee} = req.body;

    // check if there are items in the cart
    if(!cartItems || cartItems.length < 1){
        res.status(400)
        throw new Error('No cart items provided')
    }
    if(!tax || !shippingFee){
        res.status(400)
        throw new Error('Please provide tax and shipping')
    }
    let orders = [];
    let subtotal = 0;

    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id : item.productId})
        if(!dbProduct){
            res.status(404)
            throw new Error('No product was found.')
        }
        const {name, price, image, _id, quantity} = dbProduct;
        const singleOrderItem = {
            quantity : item.quantity,
            price,
            name,
            image,
            productId : _id
        }
        // add cart item to order
        orders = [...orders, singleOrderItem];
        subtotal += item.quantity * price;
    }
    const total = subtotal + tax + shippingFee
    // get stripe client secret
    // const paymentIntent = await 
    res.send('create orders')
});

const getAllOrders = asyncHandlers(async (req, res)=>{
    res.send('Get all orders')
});

const getSingleOrder = asyncHandlers(async(req,res)=>{
    res.send('Get single orders')
});

const updateOrder = asyncHandlers(async(req,res)=>{
    res.send('update order')
});

const getCurrentOrders = asyncHandlers(async(req,res)=>{
    res.send('current orders')
});

module.exports = {createOrder, getSingleOrder, getAllOrders, updateOrder, getCurrentOrders}