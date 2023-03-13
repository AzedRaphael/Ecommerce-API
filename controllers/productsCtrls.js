const asyncHandlers = require('express-async-handler')
const Product = require('../model/productModel')
const Review = require('../model/reviewModel')
const cloudinary =  require('cloudinary').v2;
const fs = require('fs')

const createProducts = asyncHandlers(async(req,res)=>{
    req.body.userId = req.user._id
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename : true,
        folder : "file-upload"
    });
    req.body.image = result.secure_url;
    const product = await Product.create(req.body)
    fs.unlinkSync(req.files.image.tempFilePath)

    res.status(200).json(product)
});

const getAllProducts = asyncHandlers(async(req,res)=>{
    const product = await Product.find({})
    if(!product){
        res.status(400)
        throw new Error('Products  not found')
    }
    res.status(200).json({count :product.length ,product})
});

const getSingleProducts = asyncHandlers(async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findOne({_id:id}).populate('reviews')
    if(!product){
        res.status(400)
        throw new Error("No product was found")
    }
    res.status(200).json(product)
});

const deleteProducts = asyncHandlers(async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findOne({_id:id});
    if(!product){
        res.status(404)
        throw new Error('Product not found') 
    }

     // First, delete the reviews that belong to the product
     await Review.deleteMany({ productId: id });

     // Then, delete the product itself
     await Product.findByIdAndDelete(id);

    res.status(200).json({msg:"Product deleted successfully"})
});

const updateProducts = asyncHandlers(async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findOneAndUpdate({_id:id},req.body,{
        new : true,
        runValidators : true
    })
    if(!product){
        res.status(404)
        throw new Error('Product not found') 
    }
    res.status(200).json({msg:"Product Updated successfully"})
});



module.exports = {createProducts, getSingleProducts, getAllProducts, deleteProducts, updateProducts}