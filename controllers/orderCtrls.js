const asyncHandlers = require('express-async-handler');
const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const checkPermission = require('../middleware/checkPermission')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


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
        const {name, price, image, _id} = dbProduct;
        const singleOrderItem = {
            quantity : item.quantity,
            price,
            name,
            image,
            productId : item.productId
        }
        // add cart item to order
        orders = [...orders, singleOrderItem];
        subtotal += item.quantity * price;
    }
    const total = subtotal + tax + shippingFee;

    // get stripe client secret
    const paymentIntent = await stripe.paymentIntents.create({
        amount : total,
        currency : 'usd',
        automatic_payment_methods: {
            enabled: true,
        }
    })
    //const clientSecret = paymentIntent.client_secret
    const order = await Order.create({
        cartItems:orders, 
        tax, 
        total, 
        subtotal,
        shippingFee,
        clientSecret : paymentIntent.client_secret,
        userId:req.user._id
    })

    // res.json({clientSecret : paymentIntent.client_secret})
    res.status(200).json({order})
});

const getAllOrders = asyncHandlers(async (req, res)=>{
    const order = await Order.find({});
    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }

    res.status(200).json({count : order.length, order})
});

const getSingleOrder = asyncHandlers(async(req,res)=>{
    const {id} = req.params;
    const order = await Order.findOne({_id : id});

    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }

    // check for authrorized permissions
    checkPermission(req.user, order.userId);
    res.status(200).json(order)
});

const updateOrder = asyncHandlers(async(req,res)=>{
    const {id} = req.params;
    const {paymentIntentId} = req.body;
    const order = await Order.findOne({_id : id});

    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }

    // check for authrorized permissions
    checkPermission(req.user, order.userId);

    order.paymentIntentId = paymentIntentId;
    order.status = "paid"
    await order.save()
    res.status(200).json({order})
});

const getCurrentOrders = asyncHandlers(async(req,res)=>{
    const order = await Order.findOne({userId : req.user._id});
    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }
    res.status(200).json({count : order.length, order})
});

module.exports = {createOrder, getSingleOrder, getAllOrders, updateOrder, getCurrentOrders}