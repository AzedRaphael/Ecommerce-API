const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    rating : {
        type : Number,
        required:[true, "Please provide rating"],
        min:1,
        max:5
    },
    title:{
        type:String,
        required:[true, "Please provide review title"],
        trim : true,
        maxlength:100
    },
    comment:{
        type : String,
        required:[true, "Please provide review title"]
    },
    userId:{
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },
    productId:{
        type :  mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Product"
    }
},{ timestamps: true });

// user can leave only one review per product
reviewSchema.index({userId : 1, productId : 1}, {unique:true});

reviewSchema.statics.calcAvgRatings = async function (productID){
    const result = await this.aggregate([
        {$match : {productId : productID}},
        {$group :{
            _id : null, 
            averageRating :{$avg : '$rating'},
            numberOfReviews : {$sum : 1}
        }}
    ])

    try {
        await this.model('Product').findOneAndUpdate({_id : productID}, {
            averageRating : Math.ceil(result[0]?.averageRating || 0),
            numberOfReviews : result[0]?.numberOfReviews || 0,
        })
    } catch (error) {
        console.log(error)
    }
};

reviewSchema.post('save', async function(){
    await this.constructor.calcAvgRatings(this.productId)
});

reviewSchema.post('remove', async function(){
    await this.constructor.calcAvgRatings(this.productId)
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review
