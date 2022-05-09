const express=require('express')
const app=express()

const bodyparser=require('body-parser')
const router = require('./routes/route')
 app.use(bodyparser.json())

//  const mongoose=require('mongoose')
//  mongoose.connect("",
//     {useNewUrlParser:true})
//     .then(()=>console.log("mongoDB is Connected!!"))
//     .catch(err=>console.log(err))

    app.use('/',router)

    app.listen(process.env.PORT||3000,()=>{
        console.log("server connected at Port :",process.env.PORT||3000)
    })