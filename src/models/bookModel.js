const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: 'Book Title Required',
        unique: true
    },
    excerpt: {
        type: String,
        required: 'Excerpt is Required'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'userId is Required',
        ref: 'User'
    },
    ISBN: {
        type: String,
        required: 'ISBN is Required',
        unique: true
    },
    category: {
        type: String,
        required: 'Category is Required'
    },
    subcategory: {
        type: [String],
        required: 'SubCategory is Required'
    },
    reviews: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    releasedAt: Date

}, { timestamps: true })

module.exports = mongoose.model("Book", bookSchema)