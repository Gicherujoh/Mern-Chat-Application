const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const app = express();
require('dotenv/config');

//setting up middlewares
app.use(express.json())

//Connecting to MongoDB
mongoose.connect(process.env.Connection_String).then(()=>{
    console.log('Connected Successfully to MongoDB')
    app.listen(3300,()=>console.log('Server running on port 3300'))
})
const User = require('./Models/UserSchema')
//Register Endpoint
app.post('/register',async(req,res)=>{
  const {email,password}=req.body;
  try{
    const existingUser = await User.findOne({email})
    console.log(existingUser)
    if(existingUser){
       return res.json('User already exists')
    }else{
      const hashedPassword = bcrypt.hashSync(password,10)
      const newUser = await User.create({
        email,
        password:hashedPassword
      })
      if(newUser){
        return res.json(newUser)
      }else{
        res.status(500).json('Failed to create a User')
      }
    }
  }catch(err){
    console.log(err)
  }
})
//Login Endpoint
app.post('/login',async(req,res)=>{
  const {email,password} = req.body
  try{
      const checkUser = await User.findOne({email});
      if(!checkUser){
          return res.json('User doesnt Exist')
      }else{
         const checkPassword = bcrypt.compareSync(password,checkUser.password)
         if(checkPassword){
           return res.json('Login SuccessFull')
         }else{
            return res.json('Password do not match')
         }
      }
  }catch(err){
     res.json(err)
  }
})