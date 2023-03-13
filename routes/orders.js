const {createOrder, getSingleOrder, getAllOrders, updateOrder, getCurrentOrders} = require('../controllers/orderCtrls')
const router = require('express').Router();
const {authMW, adminOnly} = require('../middleware/authMiddleware');

router.route('/').get(authMW, adminOnly, getAllOrders).post(authMW,createOrder);
router.route('/showAllMyOrders').get(authMW, getCurrentOrders);
router.route('/:id').patch(authMW,adminOnly, updateOrder).get(authMW, getSingleOrder)

module.exports = router