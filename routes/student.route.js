const { model } = require('mongoose')
const studentModel = require('../models/student.model')
const route = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()

route.get('/',(req,res,next)=>{
    studentModel.testConnect().then((msg)=>{
        res.json(msg)
    }).catch(err=>res.send(err))
})

//API authorization verify token => For access all API must be token passed 
let privateKey = process.env.PRIVATE_KEY
verifyToken =(req,res,next)=>{
    let TokenAuth = req.headers.authorization //const token = req.headers['authorization'];
    if(!TokenAuth){
        res.status(400).json({msg:'access rejected ......'})
    }
    try{
       jwt.verify(TokenAuth,privateKey)
        next()
    }catch(err){
        res.status(400).json({msg:err})
    }
}


route.post('/addstudent',(req,res,next)=>{
    studentModel.addStudent(req.body.firstname,req.body.lastname,req.body.email,req.body.age,req.body.phone).then((doc)=>{
            res.send(doc)
    }).catch(err=>res.send({ErrorMessage:err}))

})

route.get('/students',verifyToken,(req,res,next)=>{
    studentModel.getAllStudents().then((msg)=>{
        let Res_Token = req.headers.authorization;
        let Dec_token = jwt.decode(Res_Token,{complete:true})
        res.json({Users:msg,UserDECODE:Dec_token})
    }).catch((err)=>req.json(err))
})

route.get('/students/:id',verifyToken,(req,res,next)=>{
    studentModel.getOneStudents(req.params.id).then((msg)=>{
        res.json(msg)
    }).catch(err=>res.status(404).json(err))

})


route.delete('/students/:id',verifyToken,(req,res,next)=>{
    studentModel.deleteOneStudents(req.params.id).then((msg)=>{
        res.json(msg)
    }).catch(err=>res.status(404).json(err))
})

route.patch('/students/:id',verifyToken,(req,res,next)=>{
    studentModel.updateOneStudents(req.params.id,req.body.firstname,req.body.lastname,req.body.email,req.body.age,req.body.phone)
    .then((msg)=>{res.json(msg)})
    .catch(err=>res.status(404).json(err))
})

module.exports=route