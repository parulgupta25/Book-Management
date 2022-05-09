const express=require('express')
const router=express.Router()
//const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")


router.get('/test',function(req,res){
    res.send('working')
})
// router.post('/register', userController.userCreation)
// router.post('/login', userController.loginUser)

//Books APIs --> Protected. => create , fetch (all books & by Id), update & delete .
router.post('/books', bookController.createBook)
router.get('/books', bookController.getBook)
router.get('/books/:bookId',  bookController.getBookById)
// router.put('/books/:bookId', middleware.userAuth, bookController.updateBookDetails)
// router.delete('/books/:bookId', middleware.userAuth, bookController.deleteBook)


module.exports=router