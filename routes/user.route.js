const routeModel = require('../models/user.model')
const route = require('express').Router()

route.post('/register',(req,res,next)=>{
    routeModel.register(req.body.username,req.body.email,req.body.password).then((user)=>{
        res.status(200).json({user:user ,message:'registred !'})
    }).catch((err)=>{
        res.status(400).json(err)
    })
})

route.post('/login',(req,res,next)=>{
    routeModel.login(req.body.email,req.body.password).then((token)=>{
        res.status(200).json({token:token ,message:'Tken are created !'})
    }).catch((err)=>{
        res.status(400).json(err)
    })
})
module.exports = route