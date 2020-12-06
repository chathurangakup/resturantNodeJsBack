const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');

const ItemsNames = require('../models/items');
const Likes = require('../models/likes');
 const ItemCategories = require('../models/itemcategories');
 const Cart = require('../models/cart');
const DateTime = require('../models/datetime');
const checkAuth=require('../middleware/check-auth');


//save date time
router.post('/addDateTime',(req,res,next)=>{
       const datetime=new DateTime({
           _id:mongoose.Types.ObjectId(),
           dayname:req.body.dayname,
           openhours:req.body.openhours,
           closehour:req.body.closehour,
           status:req.body.status,

       });
       datetime.save().then(result=>{
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
   });


//get all date and time
 router.get('/alldatetime',(req,res,next)=>{
    DateTime.find()
  .exec()
  .then(docs=>{
     
    if(docs){
       
        const responce={
            count:docs.length,
            users:docs
        }
        res.status(200).json(responce);
      }else{
        res.status(404).json({message:"No valid value"});
      }
  }).catch(err=>{
    console.log(err)
  });
});




//update date time
router.post('/updatedatetime/:timeid',checkAuth,(req,res,next)=>{
    console.log(req.body)
    DateTime.find({_id:req.params.timeid}).exec().then(user=>{
          if(user.length<1){
              return res.status(401).json({
                message:'Still no account please signin'
              })
          }else{
            DateTime.update(
              {"_id":req.params.timeid},
              {$set: {
                     
                      "openhours":req.body.openhours,
                      "closehours":req.body.closehours,
                      "status":req.body.status,
                      
              }}
          )
        .exec()
        .then(docs=>{
          if(docs){
  
             //consolele.log("kki")
              res.status(200).json({
                   result:"success",
                  message:"Updated"
              });
            }else{
              res.status(404).json({
                result:"error",
                message:"No valid value"});
            }
          }).catch(err=>{
              console.log(err)
            });
           
  
          }
      });
  
  });
  

   
   

   module.exports=router;