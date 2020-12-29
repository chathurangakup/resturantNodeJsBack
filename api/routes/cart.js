const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');

const ItemsNames = require('../models/items');
const Likes = require('../models/likes');
 const ItemCategories = require('../models/itemcategories');
 const Cart = require('../models/cart');
const Users = require('../models/users');
const checkAuth=require('../middleware/check-auth');


//save plant details from user
router.post('/addtocart',checkAuth,(req,res,next)=>{
   
 if(req.body.userid==undefined){
        res.status(500).json({
            error:"Please enter userid"
        });
  }else  if(req.body.totalprice==undefined){
    res.status(500).json({
        error:"Please enter totalprice"
    });
}else  if(req.body.cartitems.length==0){
    res.status(500).json({
        error:"Please enter itemcategoryid"
    });
}else{
    var val = Math.floor(1000 + Math.random() * 9000);
    const cartitemsdata=new Cart({
        _id:mongoose.Types.ObjectId(),
        userid:req.body.userid,
        cartitems:req.body.cartitems,
        status:'pending',
        type:req.body.type,
        date:req.body.date,
        time:req.body.time,
        image:req.body.image,
        randomid:val,
        totalprice:req.body.totalprice,
    });
    cartitemsdata.save().then(result=>{
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




  //get delivery or takeaway
  router.get('/gettypes/:type',(req,res,next)=>{
    Cart.find({ "type": req.params.type})
    .exec()
    .then(docs=>{
        res.status(200).json({
          
            types:docs.map(doc=>{
                return{
                     type_result:doc
                   
                }
            })
        })
    })
  })


  //get change status
  router.get('/changestatus/:itemid/status/:status',(req,res,next)=>{
    const itemid=req.params.itemid
    const status=req.params.status

    Cart.find({ "_id": itemid},  function(err, result) {
        if (err) {
            res.send({'error':result});
        } else {
        

            Cart.updateOne({ "_id": itemid}, {$set: { "status" :  status}}, function(err, result) {
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
  })




module.exports=router;
