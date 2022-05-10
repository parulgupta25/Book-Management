const express=require('express')
const router=express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController=require("../controllers/reviewController")
const middleware=require("../middleWare/authentication")

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)

router.post('/books', middleware.authentication,bookController.createBook)
router.get('/books',middleware.authentication, bookController.getBook)
router.get('/books/:bookId', middleware.authentication, bookController.getBookById)
router.put('/books/:bookId',middleware.authentication, bookController.updateBook)
router.delete('/books/:bookId',middleware.authentication, bookController.deleteBook)

router.post('/books/:bookId/review', reviewController.addReview)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)


module.exports=router