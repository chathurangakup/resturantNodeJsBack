const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');

const ItemsNames = require('../models/items');
const Likes = require('../models/likes');
 const ItemCategories = require('../models/ItemCategories');
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
    const cartitemsdata=new Cart({
        _id:mongoose.Types.ObjectId(),
        userid:req.body.userid,
        cartitems:req.body.cartitems,
        status:'pending',
        type:req.body.type,
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






module.exports=router;
