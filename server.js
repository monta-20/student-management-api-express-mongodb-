const express = require ('express')
const app = express()
const studentRoute = require('./routes/student.route')
const userRoute = require('./routes/user.route')
require('dotenv').config()

const port = process.env.PORT
app.use(express.json()) //Send or recieve Data to client/server
app.use(express.urlencoded({extended:true})) //Recieve data FORM  

app.use('/',studentRoute)
app.use('/',userRoute)
//CORS : secure our api , not protected 100% because exist extension in brower to allow CORS
//SOLUTION : SecrtKEY
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*"); // Allow all domains or specific domain
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, authorization");
    next();
})

app.listen(port,()=>console.log(`Listen on PORT ${port}`))