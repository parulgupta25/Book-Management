const jwt=require("jsonwebtoken")

const authentication=async function(req,res,next){

    try{

    let token = req.headers["x-api-key"]

    if (!token)return res.status(400).send({ status: false, msg: "token not found" })

    let decodedToken = jwt.verify(token,"NONOINWW2Q9NAQO2OQ0#jn$@ono@")//verify token
    
    if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })
    
    //let userId=decodeToken.userId
     next()

    }catch(err){

        res.status(500).send({status:false,Error:err.message})
    }
}



module.exports={authentication}