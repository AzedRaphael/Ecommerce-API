const express = require('express');
const router = express.Router();
const {createReview, getAllReviews,getSingleReview, updateReview, deleteReview} = require('../controllers/reviewCtrls');
const {authMW, adminOnly} = require('../middleware/authMiddleware')

router.route('/').post(authMW,createReview).get(getAllReviews)
router.route('/:id').get(getSingleReview).patch(authMW, updateReview).delete(authMW,adminOnly,deleteReview)

module.exports = router;