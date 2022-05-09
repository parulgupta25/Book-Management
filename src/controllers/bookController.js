const bookModel=require('../models/bookModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

const createBook=async function(req,res){

    try{

    let data=req.body
    
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt }=data

    if(!Object.keys(data).length)return res.status(400).send("Please enter the Book Details")
   
    if (!title.trim()) {
        return res.status(400).send({ status: false, message: "Title must be present" })
    };

    if (!excerpt.trim()) {
        return res.status(400).send({ status: false, message: "excerpt must be present" })
    };

    if (!userId.trim()) {
        return res.status(400).send({ status: false, message: "userId must be present" })
    };

    if (!ISBN.trim()) {
        return res.status(400).send({ status: false, message: "ISBN must be present" })
    };

    if (!category.trim()) {
        return res.status(400).send({ status: false, message: "category must be present" })
    };

    if (!subcategory.trim()) {
        return res.status(400).send({ status: false, message: "subcategory must be present" })
    };

    if (!releasedAt) {
        return res.status(400).send({ status: false, message: "releasedAt must be present" })
    };

    if (isDeleted==true) {
        return res.status(400).send({ status: false, message: "we can't deleted a document while creating" })
        //deletedAt=new Date()
    };

    if(!Array.isArray(subcategory)){
        return res.status(400).send({ status: false, message: "subcategory should be an array" })
    }

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: `Invalid userId.` })
    }

    let checkUser=await userModel.findById(userId)
    if(!checkUser){
        return res.status(400).send({ status: false, message: "UserId Not Found" })
    }

   let checkTitile=await bookModel.findOne({title:title})  //isDeleted:false
   if(checkTitile){
    return res.status(400).send({ status: false, message: "Title Already Exists" })
   }

   let checkISBN=await bookModel.findOne({ISBN:ISBN})  //isDeleted:false
   if(checkISBN){
    return res.status(400).send({ status: false, message: "ISBN Already Exists" })
   }

   const newBook = await bookModel.create(data);

   res.status(201).send({ status: true, message: "Book created successfully", data: newBook })

}catch(err){

    return res.status(500).send({ status: false, error:err.message })
}
}

const getBook=async function(req,res){

    try{

 let data=req.query

 if(!Object.keys(data).length) return res.status(400).send("Please enter the Details")

 if(!Array.isArray(data.subcategory)){
    return res.status(400).send({ status: false, message: "subcategory should be an array" })
}

 if (!mongoose.isValidObjectId(data.userId)) {
    return res.status(400).send({ status: false, message: `Invalid userId.` })
}

let checkUser=await userModel.findById(data.userId)
if(!checkUser){
    return res.status(400).send({ status: false, message: "UserId Not Found" })
}
const bookList = await bookModel.find({data,isDeleted:false})
.select({subcategory: 0,ISBN: 0,isDeleted: 0,updatedAt: 0,createdAt: 0,__v: 0}).sort({title: 1});

res.status(200).send({ status: true, message: "Book List",data:bookList })

if(!bookList){
    return res.status(400).send({ status: false, message: "Book Not Found" })
}
}catch(err){

    res.status(500).send({ status: false,error:err.message })
}
}

const getBookById=async function(req,res){

    try{

 let data=req.params.bookId
 
 if (!mongoose.isValidObjectId(data)) {
    return res.status(400).send({ status: false, message: `Invalid userId.` })
}

let checkBook=await bookModel.findOne({_id:data,isDeleted:false})
if(!checkBook){
    return res.status(400).send({ status: false, message: "BookId Not Found" })
}

const getReviewsData = await reviewModel.find({ bookId: bookParams, isDeleted: false })
.select({ deletedAt: 0, isDeleted: 0, createdAt: 0, __v: 0, updatedAt: 0 }).sort({reviewedBy: 1})

checkBook.reviewsData=getReviewsData

res.status(200).send({ status: true, message: "Book List",data:getReviewsData })


    }catch(err){

        res.status(500).send({ status: false,error:err.message })

    }
}

module.exports={createBook,getBook,getBookById}