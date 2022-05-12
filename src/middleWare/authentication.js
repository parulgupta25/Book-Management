const bookModel=require("../models/bookModel")
const jwt=require("jsonwebtoken")
const mongoose=require('mongoose')


/************************************************Authentication MiddleWare**************************************************/

const authentication=async function(req,res,next){

    try{

    let token = req.headers["x-api-key"]

    if (!token)return res.status(400).send({ status: false, msg: "token not found" })

    let decodedToken = jwt.verify(token,"NONOINWW2Q9NAQO2OQ0#jn$@ono@")
    
    if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })

     next()

    }catch(err){

        res.status(500).send({status:false,Error:err.message})
    }
}


/************************************************Authorization MiddleWare**************************************************/

const authorization=async function(req,res,next){

    try{

    let token = req.headers["x-api-key"]

    if (!token)return res.status(400).send({ status: false, msg: "token not found" })

    let decodedToken = jwt.verify(token,"NONOINWW2Q9NAQO2OQ0#jn$@ono@")
    
    if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })
    
    let usersId=decodedToken.userId
    let bodyData=req.body.userId
    let booksId = req.params.bookId

    if(bodyData){
        if (usersId != bodyData) {
        return res.status(403).send
        ({status: false, message: "Unauthorized access ! User's credentials doesn't match."})}
    }

    if (!mongoose.isValidObjectId(booksId)) return res.status(400).send({ status: false, message: "The Id is Invalid." })

    let checkBook = await bookModel.findOne({ _id: booksId, isDeleted: false })
    if (!checkBook) return res.status(400).send({ status: false, message: "BookId Not Found" })

    if(booksId){
      let checkBook=await bookModel.findOne({_id:booksId,userId:usersId})
      if(!checkBook){ return res.status(403).send
        ({status: false, message: "Unauthorized access ! User's credentials doesn't match."})}
    }

    next()

    }catch(err){
     res.status(500).send({status:false,Error:err.message})
     }
}



module.exports={authentication,authorization}