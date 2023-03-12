const asyncHandler = require('express-async-handler');
const Review = require('../model/reviewModel');
const Product = require('../model/productModel');
const checkPermission = require('../middleware/checkPermission')

const createReview = asyncHandler(async(req, res)=>{
    const {productId : product} = req.body;
    // Check if the product has a valid product id
    const isValidProduct = await Product.findOne({_id:product});
    if(!isValidProduct){
        res.status(404)
        throw new Error('No product with this Id')
    }
    // Check if user already submitted a review
    const isSubmitted = await Review.findOne({
        productId : product, 
        userId : req.user._id
    });
    if(isSubmitted){
        res.status(400)
        throw new Error('Product review exists ')
    }
    req.body.userId = req.user._id
    const review = await Review.create(req.body)
    res.status(200).json(review)
});

const getAllReviews = asyncHandler(async(req, res)=>{
    const review = await Review.find({})
    .populate({
        path : "productId", 
        select: "name company price"
    })
    .populate({
        path : "userId",
        select : "name"
    });
    if(!review){
        res.status(404)
        throw new Error('Review not found')
    }
    res.status(200).json({count : review.length, review})
});

const getSingleReview = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const review = await Review.findOne({_id:id})
    if(!review){
        res.status(400)
        throw new Error("No review was found")
    }
    res.status(200).json(review)
});

const updateReview = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {title:bodyTitle, rating:bodyRating, comment:bodyComment} = req.body;
    const review = await Review.findOne({_id:id})
    const {rating, title, comment} = review
    if(!review){
        res.status(404)
        throw new Error('Review not found')
    }
    // check for users permission
    checkPermission(req.user, review.UserId)
    // if(req.user._id.toString() !== review.userId.toString()){
    //     res.status(400)
    //     throw new Error('You cant delete this review')
    // }
    review.rating = bodyRating || rating;
    review.comment = bodyComment || comment;
    review.title = bodyTitle || title;
    await review.save()
    res.status(200).json('Review updated successfully')
});

const deleteReview = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const review = await Review.findOne({ _id: id });

    // check persmission before deleting
    checkPermission(req.user, review.UserId);
 
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.remove()
    res.status(200).json({msg:"Review deleted successfully"})
});

const getSingleProductReviews = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const review = await Review.find({productId:id})
    res.status(200).json({count:review.length,review});
})

module.exports = {createReview, getAllReviews,getSingleReview, updateReview, deleteReview, getSingleProductReviews}