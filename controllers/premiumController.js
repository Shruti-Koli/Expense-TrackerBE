const User = require('../models/user');
const PreviousDownloads = require('../models/previousdownloads');
const Expenses = require('../models/expense');
const AWS = require('aws-sdk')

const S3services = require('../services/S3services');

const getPrevFiles = async(req, res)=>{
    try{
        const prevdata = await req.user.getPreviousDownloads({order: [['createdAt', 'ASC']]});
        // const prevdata = await req.user.getPreviousDownloads();
        //console.log(prevdata);
        res.status(200).json(prevdata);
        
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }


    
}

const getFile = async (req, res) => {
    try{
        const expenses = await req.user.getExpenses();

        const stringifiedExpenses = JSON.stringify(expenses);
        const userid = req.user.id;
        const filename = `Expenses${userid}/${new Date()}.txt`;
        const fileURL = await S3services.uploadToS3(stringifiedExpenses,filename); 
        // const prevdata = await PreviousDownloads.create({ fileURL: fileURL,userId:userid})
        const prevdata = await req.user.createPreviousDownload({ fileURL: fileURL})
        //console.log(prevdata)
        res.status(200).json({fileURL:fileURL,prevdata:prevdata});
        
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
}

const getUserLeaderBoard  = async (req,res)=>{
    try{
        const leaderBoarData = await User.findAll({
            order:[['totalExpense', 'DESC']]
        })
       
        res.status(200).json(leaderBoarData);
        
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }   
}

module.exports={
    getUserLeaderBoard,
    getFile,
    getPrevFiles
}