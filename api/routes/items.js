const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');

const ItemsNames = require('../models/items');
const Users = require('../models/users');
const checkAuth=require('../middleware/check-auth');


//save plant details from user
router.post('/addItemName',checkAuth,(req,res,next)=>{
   
 if(req.body.itemname==undefined){
        res.status(500).json({
            error:"Please enter itemname"
        });
  }else{
    const itemnames=new ItemsNames({
        _id:mongoose.Types.ObjectId(),
        itemname:req.body.itemname,
        categotyitems:[],
    
      
    });
    itemnames.save()
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
        console.log('kkk')
    }
});



//get all items
router.get('/allmenuitems',(req,res,next)=>{
    ItemsNames.find()
    .exec()
    .then(docs=>{
        console.log(docs.length)
     
      const reversed = docs.reverse();
        res.status(200).json({
            count:reversed.length,
            items:reversed.map(doc=>{
                return{
                     menuItemsId:doc._id,
                     menuItemsName:doc.itemname,
                   
                }
            })
        })
    })
})




//add menu items categories
router.post('/addmenucategories/:itemid',checkAuth,(req,res,next)=>{
    const itemid=req.params.itemid
  
    const categoryofItems= {
      menucategoryid:mongoose.Types.ObjectId(),
      categoryname:req.body.categoryname,
      image:req.body.image,
      description:req.body.description,
      price:req.body.price
     
  };
  
  ItemsNames.find({ "_id": itemid},  function(err, result) {
    if (err) {
        res.send({'error':result});
    } else {
     
    //   console.log(result[0].likedusers.length)
    //   var commentlen=result[0].commentsofusers.length;
        ItemsNames.updateOne({ "_id": itemid}, {$addToSet: { "categotyitems" :  categoryofItems}}, function(err, result) {
          console.log(err) 
            //  console.log(result)
          if (err!=null) {
            console.log('kkk')
            res.status(200).json({error:'An error has occurred'});
          } else {
            console.log('lll')
            //if update update islike parametor
          
             //consolele.log("kki")
              res.status(200).json({
                  result:"success",
                  message:"Updated"
              });

          }
        });
      }
  });
  });


  //get all item categories
router.get('/getallcategories/:itemid',(req,res,next)=>{
    ItemsNames.find({ "_id": req.params.itemid})
    .exec()
    .then(docs=>{
        res.status(200).json({
          
            plants:docs.map(doc=>{
                return{
                     itemcate:doc.categotyitems
                   
                }
            })
        })
    })
  })
  



module.exports=router;
