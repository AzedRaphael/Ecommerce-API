const express = require('express');
const router = express.Router();
const {authMW, adminOnly} = require("../middleware/authMiddleware")
const {createProducts, getSingleProducts, getAllProducts, deleteProducts, updateProducts} = require('../controllers/productsCtrls')
const {getSingleProductReviews} = require('../controllers/reviewCtrls')

router.route("/").post(authMW,adminOnly, createProducts).get(getAllProducts)
router.route("/:id").get(getSingleProducts).delete(authMW,adminOnly,deleteProducts).patch(authMW,adminOnly,updateProducts)
router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router