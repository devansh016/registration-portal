const User = require('../models/user');
const googleSheets = require('../util/googleSheet');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

async function register(req, res, next) {

    const { name, phone, email, college, address1, address2, city, pincode, state} = req.body;
    var user_detail = await User.findOne({ email });

    // If user exists in database
    if (user_detail) {
        if(user_detail.paymentStatus){
             // Payment already done 
            res.status(200).json({
                StatusCode: "201",
                message: "Payment Already Done."
            }).send();
            return ;
        }else{ 
            // Payment not done
            await User.deleteOne({ "email": req.body.email });
        }
    }

    // Razorpay
    const razorpay = new Razorpay({
        key_id: process.env.razorpay_key_id,
        key_secret: process.env.razorpay_key_secret
    })
    
    var options = {
        amount: 20000, // RS 200
        currency: "INR",
        receipt: "order_rcptid_11",
        notes: { 
            name, phone, email
        }
    };
        
    try {
        // Order Details Send to RazorPay
        const response = await razorpay.orders.create(options)

        // Saving User Details and razorpay order id in our database
        const user = new User({
            name, phone, email, college, address1, address2, city, pincode, state,
            "order_id": response.id
        });
        await user.save();

        //Sending payment id and other details back to user
        res.json({
            StatusCode: "1",
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            name, phone, email,
            "razorpay_key_id": process.env.razorpay_key_id
          })
        } catch (error) {
            console.log(error);
            res.status(200).json({
                StatusCode: "201",
                message: "Unable to create order."
            }).send();
        }
}

async function verifyPayment(req, res, next){
    var msg = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var generated_signature = await crypto.createHmac('SHA256', process.env.razorpay_key_secret).update(msg).digest('hex');

    // Verify Signature
    if (generated_signature == req.body.razorpay_signature) {
        // Updating payment status
        const currentDate = Date.now()
        await User.updateOne({ order_id: req.body.razorpay_order_id },{paymentStatus: true, paymentDate: currentDate });

        // Inserts data to google sheets
        var user_data = await User.findOne({ order_id: req.body.razorpay_order_id });
        await googleSheets.insertData([user_data.name, user_data.email, user_data.phone, user_data.college, user_data.address.address1, user_data.address.address2, user_data.address.city, user_data.address.state, user_data.address.pincode, user_data.order_id, user_data.paymentDate ]);

        res.redirect('/thankyou.html');
    }
    else {
        res.send("Payment Failed.");
    }
}

module.exports ={
    register,
    verifyPayment
}