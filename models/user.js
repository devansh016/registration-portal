const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String,  required: true},
    college: {type: String, required: true},
    phone: {type: String, required: true},
    address: {
        address1:{type: String, required: true},
        address2: {type: String},
        city: {type: String, required: true},
        pincode:{type: String, required: true},
        state: {type: String, required: true},
    },
    order_id: {type: String, required: true},
    paymentStatus:{type: Boolean, default: false},
    paymentDate: { type: Date },
    createdDate: { type: Date, default: Date.now }
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('User', userSchema);