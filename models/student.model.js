const mongoose = require('mongoose')
const Joi = require('joi')
require('dotenv').config()

//For Validation inputs with joi 
const schemaValidation =Joi.object({
    firstName:Joi.string().alphanum().min(2).max(20).required(),
    lastName:Joi.string().alphanum().min(2).max(20).required(),
    Email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    Age:Joi.number().required(),
    Phone:Joi.number().required() 
})
let schemaStudent = mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    age:Number,
    phone:Number
})

let Student = mongoose.model('student',schemaStudent)

let url =process.env.URL

exports.testConnect =()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url).then(()=>{
            mongoose.disconnect()
            resolve('connect')
        }).catch(err=>reject(err))
    })
}

exports.addStudent = async (firstname, lastname, email, age, phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to MongoDB
            await mongoose.connect(url);
            
            // Add Validation
            const valid = await schemaValidation.validateAsync({
                firstName: firstname,
                lastName: lastname,
                Email: email,
                Age: age,
                Phone: phone
            });
            
            // If validation fails, reject the promise
            if (valid.error) {
                mongoose.disconnect();
                return reject(valid.error.details[0].message);
            }
            
            // Create new student document
            let std = new Student({
                firstname: firstname,
                lastname: lastname,
                email: email,
                age: age,
                phone: phone
            });
            
            // Save the student document
            const doc = await std.save();
            mongoose.disconnect();
            resolve(doc);
        } catch (err) {
            mongoose.disconnect();
            reject(err);
        }
    });
};


exports.getAllStudents=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url).then(()=>{
            
            return Student.find()

        }).then((doc)=>{
            mongoose.disconnect()
            resolve(doc)

        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getOneStudents=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url).then(()=>{
            
            return Student.findById(id)

        }).then((doc)=>{
            mongoose.disconnect()
            resolve(doc)

        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.deleteOneStudents=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url).then(()=>{
            
            return Student.deleteOne({_id:id}) 

        }).then((doc)=>{
            mongoose.disconnect()
            resolve(doc)

        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.updateOneStudents=(id ,firstname,lastname,email,age,phone)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url).then(()=>{
            
            return Student.updateOne({_id:id},{ 
                firstname:firstname,
                lastname:lastname,
                email:email,
                age:age,
                phone:phone})

        }).then((doc)=>{
            mongoose.disconnect()
            resolve(doc)

        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}