const bcrypt = require('bcrypt');
require('dotenv').config();
const Users = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken=(id, name, ispremiumuser)=>{
    return jwt.sign({userId:id, name: name, ispremiumuser },process.env.JSW_WEB_TOKEN_SECRETKEY);
}

const signup = async (req,res,next)=>{
    try{
        const name = req.body.name.trim();
        const email= req.body.email.trim();
        const pass = req.body.pass;
        console.log(`sign up with:${name} ${email} ${pass}`)
        if(Invalidstring(name) || Invalidstring(email) || Invalidstring(pass)){
            return res.status(400).json({err:'All the fields are mandatory'})
        }
        const user =await Users.findAll({where:{email:email}});
        if(user.length>0){
            return res.status(400).json({message:'User already exists'})
        }else{
          bcrypt.hash(pass,10,async (err,hash)=>{
            const data = await Users.create({
              name: name,
              email : email,
              password : hash
          })
          res.status(201).json({message:"Successfully new user created"}) 
          })
        }
    }catch(err){
        res.status(500).json(err)
    }
}

const login = async(req,res,next)=>{
    try{
        const email= req.body.email.trim();
        const pass = req.body.pass;
        console.log(`with: ${email} ${pass}`)
        if(Invalidstring(email) || Invalidstring(pass)){
            return res.status(400).json({success:false,message:'All the fields are mandatory'})
        }
        const user =await Users.findAll({where:{email:email}});
        if(user.length>0){
          bcrypt.compare(pass,user[0].password,(err,result)=>{
            if(err){
              res.status(500).json({success:false,message:"Something Went Wrong"});
            }
            if(result==true){
              res.status(201).json({success:true,message:"Successfully loggedIn", token:generateToken(user[0].id, user[0].name, user[0].ispremiumuser)})
            }else{
              res.status(401).json({success:false,message:"Password is incorrect"})
          }
          });
        }
        else{
            res.status(404).json({success:false,message:"User not found"})
        }
        
    }catch(err){
        res.status(500).json({message:err,success:false})
    }
}


function Invalidstring(str){
    if(str.trim().length==0 || str == undefined){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    signup,
    login,
    generateToken
}