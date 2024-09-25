const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
let schemaUser = mongoose.Schema({
    username:String,
    email:String,
    password:String
})

let url =process.env.URL

let User = mongoose.model('user',schemaUser)
//Rgister
exports.register =(username,email,password)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url).then(()=>{
            return User.findOne({email:email})
        }).then((doc)=>{
            if(doc){
                mongoose.disconnect()
                reject("This email is exist.")
            }else{
                bcrypt.hash(password,10).then((hpassword)=>{
                    let user = new User({
                        username:username,
                        email:email,
                        password:hpassword
                    })
                    return user.save().then((doc)=>{
                        mongoose.disconnect()
                        resolve(doc)
                    }).catch((err)=>{
                        mongoose.disconnect()
                        reject(err)
                    })
                }).catch(err=>{
                    mongoose.disconnect()
                    reject(err)
                })
            }
        })
    })
}
//Login
let privateKey = process.env.PRIVATE_KEY
exports.login = (email,password)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url).then(()=>{
            return User.findOne({email:email})
        }).then((user)=>{
            if(!user){
                mongoose.disconnect()
                reject("We cdon't have this email ,Please Create account.")
            }else{
                bcrypt.compare(password,user.password).then((Bool_OK)=>{
                    if(Bool_OK){
                        //Create Token 
                        let token= jwt.sign({id:user._id,username:user.username},
                            privateKey,{
                                expiresIn:'1h'//Token expire after 1 hour.
                            }
                         )//Payload ,SecretKey,Algorithme
                         mongoose.disconnect();
                         resolve(token)
                    }else{
                        mongoose.disconnect()
                        reject('invalid password')
                    }
                }).catch((err)=>{
                    mongoose.disconnect();
                    reject(err);
                })
            }
        })
    })
}