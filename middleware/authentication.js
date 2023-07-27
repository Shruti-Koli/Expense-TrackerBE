const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req,res,next)=>{
    try{
        const token = req.header('auth');
        const data = jwt.verify(token,'1234secretKey');
        console.log(data.userId);
        const user = await User.findByPk(data.userId);
        req.user = user;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false,message:"something went wrong"});
    }
}