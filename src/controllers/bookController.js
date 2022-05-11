const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const mongoose = require('mongoose')



/************************************************Create Book API**************************************************/

const createBook = async function (req, res) {
    try {

        let data = req.body

        // if (userId != req.userId) {
        // return res.status(403).send({status: false, message: "Unauthorized access ! User's credentials doesn't match."})}

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!Object.keys(data).length) return res.status(400).send("Please enter the Book Details")

        if (!title) return res.status(400).send({ status: false, message: "Title must be present" })

        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt must be present" })

        if (!userId) return res.status(400).send({ status: false, message: "userId must be present" })

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN must be present" })

        if (!category) return res.status(400).send({ status: false, message: "category must be present" })

        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory must be present" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt must be present" })

        if (data.isDeleted == true) data.deletedAt = Date.now()

        if (!Array.isArray(subcategory)) return res.status(400).send({ status: false, message: "subcategory should be an array" })

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: `Invalid userId.` })

        let checkUser = await userModel.findById(userId)

        if (!checkUser) return res.status(400).send({ status: false, message: "UserId Not Found" })

        let checkTitile = await bookModel.findOne({ title: title })

        if (checkTitile) return res.status(400).send({ status: false, message: "Title Already Exists" })

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })

        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN Already Exists" })

        const newBook = await bookModel.create(data);

        res.status(201).send({ status: true, message: "Book created successfully", data: newBook })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

/************************************************Get Book Details API**********************************************/

const getBook = async function (req, res) {
    try {

        let data = req.query

        if (!Object.keys(data).length) return res.status(400).send("Please enter the Details")

        if (!mongoose.isValidObjectId(data.userId)) return res.status(400).send({ status: false, message: `Invalid userId.` })

        let checkUser = await userModel.findById(data.userId)

        if (!checkUser) return res.status(400).send({ status: false, message: "UserId Not Found" })

        data.isDeleted = false

        const bookList = await bookModel.find(data)
            .select({ subcategory: 0, ISBN: 0, isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 }).sort({ title: 1 });

        res.status(200).send({ status: true, message: "Book List", data: bookList })

        if (!Object.keys(bookList).length) return res.status(400).send({ status: false, message: "Book Not Found" })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

/**********************************************Get Book Details By ID**********************************************/

const getBookById = async function (req, res) {
    try {

        let book_id = req.params.bookId

        if (!mongoose.isValidObjectId(book_id)) return res.status(400).send({ status: false, message: "Invalid userId." })

        let checkBook = await bookModel.findOne({ _id: book_id, isDeleted: false }).lean()

        if (!checkBook) return res.status(400).send({ status: false, message: "BookId Not Found" })

        const getReviewsData = await reviewModel.find({ bookId: checkBook._id, isDeleted: false })
            .select({ deletedAt: 0, isDeleted: 0, createdAt: 0, __v: 0, updatedAt: 0 })

        //let result=checkBook.toObject()
        checkBook.reviewsData = getReviewsData

        res.status(200).send({ status: true, message: "Book List", data: checkBook })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


/****************************************************Update Book Details*********************************************/

const updateBook = async function (req, res) {
    try {
        const book_id = req.params.bookId
        const data = req.body

        const { title, excerpt, releasedAt, ISBN } = data


        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: 'Please provide book details to update' })

        if (!title) return res.status(400).send({ status: false, message: "Title is missing ! Please provide the title details to update." })

        if (!excerpt) return res.status(400).send({ status: false, message: "Excerpt is missing ! Please provide the Excerpt details to update." })

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is missing ! Please provide the ISBN details to update." })

        if (!releasedAt) return res.status(400).send({ status: false, message: "Released date is missing ! Please provide the released date details to update." })

        if (!mongoose.isValidObjectId(book_id)) return res.status(400).send({ status: false, message: "Invalid userId." })

        let checkBook = await bookModel.findOne({ _id: book_id, isDeleted: false })

        if (!checkBook) return res.status(400).send({ status: false, message: "BookId Not Found" })

        const checkTitle = await bookModel.findOne({ title: title, isDeleted: false })

        if (checkTitle) return res.status(400).send({ status: false, message: `${title} is already exists.Please add a new title.` })

        const checkIsbn = await bookModel.findOne({ ISBN: ISBN, isDeleted: false })

        if (checkIsbn) return res.status(400).send({ status: false, message: `${ISBN} is already registered,Please add a New.` })

        const updateBookData = await bookModel.findOneAndUpdate(
            { _id: book_id },
            { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN },
            { new: true })

        res.status(200).send({ status: true, message: "Successfully updated book details.", data: updateBookData })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}


/******************************************************Delete Book Details API********************************************/


const deleteBook = async function (req, res) {
    try {
        const book_id = req.params.bookId

        if (!mongoose.isValidObjectId(book_id))return res.status(400).send({ status: false, message: "Invalid userId." })

        let checkBook = await bookModel.findOne({ _id: book_id, isDeleted: false })

        if (!checkBook)return res.status(400).send({ status: false, message: "BookId Not Found" })

        const deleteBookData = await bookModel.findOneAndUpdate(
            { _id: book_id },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true })

        res.status(200).send({ status: true, message: "Book deleted successfullly.", data: deleteBookData })


    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}



module.exports = { createBook, getBook, getBookById, updateBook, deleteBook }