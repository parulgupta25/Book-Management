const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: { type: string, required: true, enum: [Mr, Mrs, Miss]},
    name: { type: string, required: true},
    phone: { type: string, required: true, unique: true},
    email: { type: string, required: true, unique: true}, 
    password: { type: string, required: true, minLength: 8, maxlength: 15},
    address: {
        street: { type: string},
        city: { type: string},
        pincode: { type: string}
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);