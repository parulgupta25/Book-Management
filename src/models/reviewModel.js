const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'BookId is  Required',
        ref: 'Book'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: 'This field is Required'
    },
    rating: {
        type: Number,
        minlength: 1,
        maxlength: 5,
        required: 'Rating is Required'
    },
    review: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

module.exports = mongoose.model('review', reviewSchema)