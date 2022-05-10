const jwt=require("jsonwebtoken")

const authentication=async function(req,res,next){

    try{

    let token=req.headers['x-api-key']

    if(!token){
        return res.status(400).send("No Token Found!!")
    }
    let decodeToken= jwt.verify(token,"NONOINWW2Q9NAQO2OQ0#jn$@ono@")

    if(!decodeToken) return res.status(400).send("invalid Token")

    if (Date.now() > (decoded.exp) * 1000) { 
        
        
        return res.status(400).send({ status: false, message: "Session expired! Please login again." })
    }

    let userId=decodeToken.userId
     next()

    }catch(err){

        res.status(500).send({status:false,Error:err.message})
    }
}



module.exports={authentication}