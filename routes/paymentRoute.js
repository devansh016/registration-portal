const express = require('express')
const router = express.Router();
require('dotenv').config();
const paymentController = require('../controllers/paymentController')

router.post('/orders', orders);
router.post('/paymentCapture', paymentCapture);

async function orders(req, res, next){
    paymentController.register(req,res,next);
}

async function paymentCapture(req, res, next){
    paymentController.verifyPayment(req,res,next);
}

module.exports = router;