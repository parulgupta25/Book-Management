const reviewModel=require("../models/reviewModel")
const bookModel=require("../models/bookModel")
const mongoose=require('mongoose')


/**************************************************Add Review API****************************************************/

const addReview=async function(req,res){
try{
    let book_id=req.params.bookId
    let data=req.body


    if(!Object.keys(data).length){
        return res.status(400).send("Please enter the review Details")
   }

    if(!data.reviewedBy){
        return res.status(400).send({ status: false, message: "Reviewer name must be present" })
    }

    if (!data.reviewedBy.match(/^[a-zA-Z. ]+$/)) {
        return res.status(400).send({ status: false, msg: "Reviewer can't be a number" })
    }

    if(!data.rating){
        return res.status(400).send({ status: false, message: "Rating must be present" })
    }

    if (!(data.rating >= 1 && data.rating <= 5)) {
        return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
    }

    if (!mongoose.isValidObjectId(book_id)) {
        return res.status(400).send({ status: false, message: "Invalid userId." })
    }

    console.log(book_id)
    
    let checkBook=await bookModel.findById(book_id)

    if(!checkBook){
        return res.status(400).send({ status: false, message: "BookId Not Found" })
    }

    data.bookId=checkBook._id
    data.reviewedAt = new Date()
   
    let saveReview=await reviewModel.create(data)

    if (saveReview) {
        await bookModel.findOneAndUpdate({ _id: saveReview.bookId }, { $inc: { reviews: 1 } })
    }

    const reviewDetails = await reviewModel.findOne({ _id: saveReview._id }).select({__v: 0,createdAt: 0,updatedAt: 0,isDeleted: 0})
    

    res.status(201).send({ status: true, message: "review created successfully", data: reviewDetails })
}
catch(err){
    res.status(500).send({ status: false, Error: err.message })
}
}


/**************************************************Update Review API*************************************************/

const updateReview = async function (req, res){
try{
    const book_id = req.params.bookId;
    const review_Id = req.params.reviewId
    const data = req.body


    if(!data.reviewedBy){
        return res.status(400).send({ status: false, message: "Reviewer name must be present" })
    }

    if (!data.reviewedBy.match(/^[a-zA-Z. ]+$/)) {
        return res.status(400).send({ status: false, msg: "Reviewer can't be a number" })
    }

    if(!data.rating){
        return res.status(400).send({ status: false, message: "Rating must be present" })
    }

    if (!(data.rating >= 1 && data.rating <= 5)) {
        return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
    }

    if (!mongoose.isValidObjectId(book_id)) {
        return res.status(400).send({ status: false, message: "Invalid BookId." })
    }

    if (!mongoose.isValidObjectId(review_Id)) {
        return res.status(400).send({ status: false, message: "Invalid reviewId." })
    }

    
    let checkBook=await bookModel.findById(book_id)

    if(!checkBook){
        return res.status(400).send({ status: false, message: "BookId Not Found" })
    }
    let checkReview=await bookModel.findById(review_Id).select({__v: 0,createdAt: 0,updatedAt: 0,isDeleted: 0})

    if(!checkReview){
        return res.status(400).send({ status: false, message: "reviewId Not Found" })
    }

    if (checkBook.isDeleted == true||checkReview.isDeleted==true){
        return res.status(400).send({ status: false, message: "Can't update review of a Deleted Book " })
    }
    const updateReviewData = await reviewModel.findOneAndUpdate(
        { _id: review_Id }, 
        { review: data.review, rating: data.rating, reviewedBy: data.reviewedBy }, 
        { new: true })

        let result=checkBook.toObject()
        result.reviewsData=updateReviewData

        res.status(200).send({ status: true, message: "Successfully updated the review of the book.", data: result })

}catch(err){
    res.status(500).send({ status: false, Error: err.message })
}
}


/**************************************************Delete Review API*************************************************/

const deleteReview = async function (req, res){
    try{

    const book_id = req.params.bookId;

    const review_Id = req.params.reviewId;

    if (!mongoose.isValidObjectId(book_id)) {
        return res.status(400).send({ status: false, message: "Invalid BookId." })
    }

    if (!mongoose.isValidObjectId(review_Id)) {
        return res.status(400).send({ status: false, message: "Invalid reviewId." })
    }

    let checkBook=await bookModel.findById(book_id)

    if(!checkBook){
        return res.status(400).send({ status: false, message: "BookId Not Found" })
    }
    let checkReview=await bookModel.findById(review_Id)

    if(!checkReview){
        return res.status(400).send({ status: false, message: "reviewId Not Found" })
    }

    if (checkBook.isDeleted == true||checkReview.isDeleted==true){

        return res.status(400).send({ status: false, message: "Can't Delete Review of a Deleted Book " })
    }

    const deleteReviewDetails = await reviewModel.findOneAndUpdate(
        { _id: reviewParams }, 
        { isDeleted: true, deletedAt: new Date() }, 
        { new: true })

    if (deleteReviewDetails) {
    await bookModel.findOneAndUpdate({ _id: review_Id },{$inc:{ reviews: -1 }})
     }

     return res.status(200).send({ status: true, message: "Review deleted successfully.",data:deleteReviewDetails})

    }catch(err){

        res.status(500).send({ status: false, Error: err.message })
    }
}
module.exports={addReview,updateReview,deleteReview}