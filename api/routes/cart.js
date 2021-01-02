const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');
const Pusher = require("pusher");

const ItemsNames = require('../models/items');
const Likes = require('../models/likes');
 const ItemCategories = require('../models/itemcategories');
 const Cart = require('../models/cart');
const Users = require('../models/users');
const checkAuth=require('../middleware/check-auth');

const pusher = new Pusher({
    appId: "1131473",
    key: "27dfe9a48f11cf0eb456",
    secret: "b44e2470a0fd87f1bd95",
    cluster: "ap2",
    useTLS: true
  });


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
        address:req.body.address,
        randomid:val,
        totalprice:req.body.totalprice,
    });
    cartitemsdata.save().then(result=>{
        console.log(result);
        pusher.trigger("my-channel", "my-event", {
            type:req.body.type
          });
        res.status(201).json({
            result:"Success",
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
  router.get('/gettypes/:type/userid/:userid',(req,res,next)=>{
    Cart.find({ "type": req.params.type,"userid":req.params.userid})
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


  //get delivery or takeaway by admin
  router.get('/gettypes/:type',(req,res,next)=>{
    const type=req.params.type
    Cart.aggregate([
        {
         $match: { "type":type},
       },
       {
        $sort : { userid : 1 } ,
      },
],  function(err, result){
        res.send({result})
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
