const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');

const ItemsNames = require('../models/items');
const Likes = require('../models/likes');
 const ItemCategories = require('../models/itemcategories');
const Users = require('../models/users');
const Address = require('../models/address');
const checkAuth=require('../middleware/check-auth');


//save plant details from user
router.post('/addAddress',checkAuth,(req,res,next)=>{
   
    if(req.body.address==undefined){
           res.status(500).json({
               error:"Please enter address"
           });
     }else if(req.body.userid==undefined){
        res.status(500).json({
            error:"Please enter userid"
        });
     }else{
        Address.updateMany({ "userid": req.body.userid}, {$set: { "isdefault" : false}}, function(err, result) {
            console.log(result) 
              //  console.log(result)
            if (err!=null) {
             
              res.status(200).json({error:'An error has occurred'});
            } else {

                const address=new Address({
                    _id:mongoose.Types.ObjectId(),
                    userid:req.body.userid,
                    address:req.body.address,
                    isdefault:true
                });
                address.save()
                .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            result:"Success",
                            data:result
                        }
                        );
                }).catch(err=>{
                        console.log(err);
                        res.status(500).json({
                            result:"error",
                            error:err
                        });
                });
            }
        });
    }
                
            
   });



   //get all address
   router.get('/getAllAddress/:userid',checkAuth,(req,res,next)=>{
    const useridd=req.params.userid
    
    Address.aggregate([
        {
           "$match":{"userid":mongoose.Types.ObjectId(useridd)}
       }
    ],  function(err, result){
        //  res.status({result})
          res.status(200).json({result});
       
   });
 });


   //set default true
   router.get('/updateDefault/userid/:userid/addressid/:addressid',checkAuth,(req,res,next)=>{
    const useridd=req.params.userid
    const addressidd=req.params.addressid
    
    Address.updateMany({ "userid": useridd}, {$set: { "isdefault" : false}}, function(err, result) {
        console.log(result) 
          //  console.log(result)
        if (err!=null) {
         
          res.status(200).json({error:'An error has occurred'});
        } else {
            Address.updateOne({ "_id": addressidd}, {$set: { "isdefault" : true}}, function(err, result) {
                if (err!=null) {
         
                    res.status(200).json({error:'An error has occurred'});
                  } else {
                        res.status(200).json({
                            result:"success",
                            message:"Updated"
                        });
                    }
            
            });
          //if update update islike parametor
        
           //consolele.log("kki")
            

        }
      });
 });



    //delete address
    router.get('/deleteAddress/:addressid',checkAuth,(req,res,next)=>{
        const addressid=req.params.addressid
        Address.remove({ "_id": addressid}, function(err, result) {
            if (err!=null) {
                res.status(200).json({error:'An error has occurred'});
              } else {
                res.status(200).json({
                    result:"success",
                    message:"Deleted"
                });
              }
        });
        
     });
   
module.exports=router;