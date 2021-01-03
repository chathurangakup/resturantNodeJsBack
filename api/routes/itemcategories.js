const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');

const ItemCategories = require('../models/itemcategories');

const Items = require('../models/items');
const Users = require('../models/users');
const Likes = require('../models/likes');
const checkAuth=require('../middleware/check-auth');


//save Item categories
router.post('/addItemCategories',checkAuth,(req,res,next)=>{
   
    if(req.body.itemid==undefined){
        res.status(500).json({
            error:"Please enter itemid"
        });
    }
    else if(req.body.categoryname==undefined){
        res.status(500).json({
            error:"Please enter categoryname"
        });
    }else if(req.body.price==undefined){
            res.status(500).json({
                error:"Please enter price"
            });

  }else if(req.body.image==undefined){
    res.status(500).json({
        error:"Please add image"
    });

}else{
    Items.findById(req.body.itemid)
   .then(users=>{
        if(!users){
            return  res.status(404).json({
                error:'error',
                result:"Item not found"
               
            });
        }else{
            const itemCategories=new ItemCategories({
                _id:mongoose.Types.ObjectId(),
                itemid:req.body.itemid,
                image:req.body.image,
                categoryname:req.body.categoryname,
                description:req.body.description,
                varients:[],
                comments:[],
                price:req.body.price,
                islike:false,
              
            });
            itemCategories.save()
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
   }) 
        console.log('kkk')
    }
});



//upload itemcategory image
const uploadCategoryImage = async (req, res, next) => {
 
    try {
    if(res){
      ItemCategories.update(
        {"_id":req.body.categoryid},
        {$set: {
          "image":req.body.base64image,
         }}
    )
      .exec()
    .then(docs=>{
    if(docs){
       //consolele.log("kki")
       return res.status(201).json({
        result:'success',
        message:'Upload successfull',
        path:req.body.base64image
      });
      }else{
        res.status(404).json({
            result:'error',
            message:"No valid value"});
      }
    }).catch(err=>{
        console.log(err)
      });
     
  
    }
    } catch (e) {
        next(e);
    }
  }
  
  router.post('/upload/categoryimage',checkAuth, uploadCategoryImage)
  
  
//get menu category by itemm id
  router.get('/getmenucategory/:itemid/userid/:userid?',(req,res,next)=>{
    const itemidd=req.params.itemid
    const useridd=req.params.userid
    console.log(useridd)
    var itemcatObj={}
    var itemcatDesc=[]
    var catid;
   
 
    ItemCategories.aggregate([{
      $lookup: {
          from: "likes",
          as: "likes",
          // localField: "_id",
          // foreignField: "itemcategoryid",
         
          let:{itemcategoryid:'$_id',userid: mongoose.Types.ObjectId(useridd)},
          pipeline:[
              {$match:{
                $expr:{$eq: ['$itemcategoryid', '$$itemcategoryid']},
              }},
              {$match:{
                $expr:{$eq: ['$userid', '$$userid']} 
              }}
          ],
      },
      },//end lookup
      {
        $sort : { categoryname : 1 } ,
      },
      {
          $match: {
            itemid:  mongoose.Types.ObjectId(itemidd),
          },
      },
    
  //   {$project:{_id:1,varients:1, comments:1, itemid:1, image:1, categoryname:1, description: 1, price:1, likes:1,reviews:{$divide: [ { $sum:"$comments.rating" },"$count" ]}}},

    { $addFields: { size:  { $size:"$comments" } }},
    { $addFields: { review:  {$divide: [ { $sum:"$comments.rating" }, 1]}  } },
    //  { $project: {
        
    //     "likes" : {
    //       $in: [ 'userid', useridd ]
    //     }
    //   }}
       ],  function(err, result){
          res.send({result})
      })

    


    // ItemCategories.aggregate([
    //   { $lookup:
    //      {
    //             from: "itemcategory",
    //             localField: "_id",
    //             foreignField: "itemcategoryid",
    //             as: "likes"
    //      }
    //    }
    //   ]).toArray(function(err, res) {
    //   if (err) throw err;
    //   console.log(JSON.stringify(res));
    
    // });
  // });
  


    // ItemCategories.find({ "itemid": itemid},  function(err, result) {
    //     if (err) {
    //         res.send({'error':result});
    //     } else {
    //       var obj = {};
        

    //       Likes.find({}, function(err, resultlikes){
    //         if (err) {
    //             res.send({'error':resultlikes});
    //         } else {
    //              for(var i=0;i<result.length; i++){
    //                 //   itemcatObj= { 
    //                 //     _id:result[i]._id,
    //                 //     itemid:result[i].itemid,
    //                 //     categoryname:result[i].categoryname,
    //                 //     varients:result[i].varients,
    //                 //     comments:result[i].comments,
    //                 //     price:result[i].price,
    //                 //     description:result[i].description,
    //                 //     image:result[i].image,
    //                 //     isLike:false
    //                 //  };
    //                 //  itemcatDesc.push(itemcatObj);

    //                   for(var j=0;j<resultlikes.length;j++){
    //                         if(resultlikes[j].itemcategoryid=result[i]._id){
    //                                 console.log(result[i]._id+'==='+resultlikes[j].itemcategoryid+'   dd'+i)
    //                                 itemcatDesc.slice(i,1)
    //                                 itemcatObj= { 
    //                                   _id:result[i]._id,
    //                                   itemid:result[i].itemid,
    //                                   categoryname:result[i].categoryname,
    //                                   varients:result[i].varients,
    //                                   comments:result[i].comments,
    //                                   price:result[i].price,
    //                                   description:result[i].description,
    //                                   image:result[i].image,
    //                                   isLike:resultlikes[j].islike
    //                                };
    //                                itemcatDesc.push(itemcatObj) 
    //                                break;                        
    //                          }
                
    //                   }
 
    //                 }
            
    //                 res.send({itemcatDesc})
               
    //         }
    //       })
        
    //     }
    // });

  })


//get liked all item category
router.get('/getalllikesitems/userid/:userid/search/:searchtxt?',(req,res,next)=>{
  const useridd=req.params.userid
  const searchtxt=req.params.searchtxt
  var itemcatObj={}
  var itemcatDesc=[]

  console.log(searchtxt)
  if(searchtxt==undefined){
    ItemCategories.aggregate([{
      $lookup: {
          from: "likes",
          as: "likes",
          // localField: "_id",
          // foreignField: "itemcategoryid",
          let:{itemcategoryid:'$_id',userid: mongoose.Types.ObjectId(useridd),islike:true},
          pipeline:[
              {$match:{
                $expr:{$eq: ['$itemcategoryid', '$$itemcategoryid']},
              }},
              {$match:{
                $expr:{$eq: ['$userid', '$$userid']} 
              }},
              {$match:{
                $expr:{$eq: ['$islike', '$$islike']} 
              }}
          ],
         
      },
  
      },//end lookup
      {"$match":{"likes":{"$ne":[]}}},
      //{"$match":{"categoryname":searchtxt}}
     // {$regexMatch: { input:"$categoryname",regex:/Egg/}} ,
      // { $addFields: { result: { $regexMatch: { input: "$categoryname", regex:searchtxt,options: "i" } } } },
      // {"$match":{"result":true}},
  
      { $addFields: { size:  { $size:"$comments" } }},
      { $addFields: { review:  {$divide: [ { $sum:"$comments.rating" }, 1]}  } },
    
  
       ],  function(err, result){
           //  res.status({result})
             res.status(200).json({result});
          
      })
  
    

  }else{
    ItemCategories.aggregate([{
      $lookup: {
          from: "likes",
          as: "likes",
          // localField: "_id",
          // foreignField: "itemcategoryid",
          let:{itemcategoryid:'$_id',userid: mongoose.Types.ObjectId(useridd),islike:true},
          pipeline:[
              {$match:{
                $expr:{$eq: ['$itemcategoryid', '$$itemcategoryid']},
              }},
              {$match:{
                $expr:{$eq: ['$userid', '$$userid']} 
              }},
              {$match:{
                $expr:{$eq: ['$islike', '$$islike']} 
              }}
          ],
         
      },
  
      },//end lookup
      {"$match":{"likes":{"$ne":[]}}},
      //{"$match":{"categoryname":searchtxt}}
     // {$regexMatch: { input:"$categoryname",regex:/Egg/}} ,
      { $addFields: { result: { $regexMatch: { input: "$categoryname", regex:searchtxt,options: "i" } } } },
      {"$match":{"result":true}},
  
  
    
  
       ],  function(err, result){
           //  res.status({result})
             res.status(200).json({result});
          
      })
  
    
  }



})




//get itemmenucategory data by _id
router.get('/getuniqueitemcat/:menucatid',(req,res,next)=>{
  const menucatid=req.params.menucatid

  ItemCategories.aggregate([
    {
    "$match":{"_id":mongoose.Types.ObjectId(menucatid)},
   }
],  function(err, result){
           //  res.status({result})
             res.status(200).json({result});
          
   })
 
  // ItemCategories.find({ "_id": menucatid},  function(err, result) {
  //     if (err) {
  //         res.send({'error':result});
  //     } else {
  //       console.log(result)
      

              // for(var j=0;j<resultlikes.length;j++){
              
                  // for(var i=0;i<result.length;i++){
                    
                  //     if(resultlikes[i]!=undefined){
                  //         console.log(resultlikes[i].itemcategoryid)
                  //         if(result[i]._id=resultlikes[i].itemcategoryid && resultlikes[i].islike==true){
                  //               //  console.log(resultlikes[j].itemcategoryid)
                  //                 itemcatObj= { 
                  //                     _id:result[i]._id,
                  //                     itemid:result[i].itemid,
                  //                     categoryname:result[i].categoryname,
                  //                     varients:result[i].varients,
                  //                     comments:result[i].comments,
                  //                     price:result[i].price,
                  //                     description:result[i].description,
                  //                     image:result[i].image,
                  //                     isLike:resultlikes[i].islike
                  //                 };
                  //                 itemcatDesc.push(itemcatObj)
                  //        }
                  //     }
      
                  // }
          
  //             res.send({result})
             
        
  //       console.log(result)
  //     }
  // });

})





  //add comments
router.post('/addcomment/:itemcatid',checkAuth,(req,res,next)=>{
    const itemcatid=req.params.itemcatid
  
    const commentofUsers= {
      commentid:mongoose.Types.ObjectId(),
      userid:req.body.userid,
      username:req.body.username,
      date:req.body.date,
      comment:req.body.comment,
      rating:req.body.rating  
  };
  
  ItemCategories.find({ "_id": itemcatid},  function(err, result) {
    if (err) {
        res.send({'error':result});
    } else {
      //var commentlen=result[0].commentsofusers.length;
      ItemCategories.updateOne({ "_id": itemcatid}, {$addToSet: { "comments" :  commentofUsers}}, function(err, result) {
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
  
  

  //get delete comments user for plants
router.get('/deletecomment/:itemcatid/commentid/:commentid',checkAuth,(req,res,next)=>{
  console.log(req.params.commentid)
  const itemcatid=req.params.itemcatid
  const commentidd=req.params.commentid

    ItemCategories.find({ "_id": itemcatid},  function(err, result) {
      if (err) {
        res.send({'error':result});
    } else {
      console.log(result[0])
      //  var commentlen=result[0].commentsofusers.length;
       for(var i=0; i<result[0].comments.length;i++){
      
        if(result[0].comments [i].commentid==commentidd){
        
          ItemCategories.updateOne({"_id": itemcatid}, {$pull: { "comments" :  { commentid: mongoose.Types.ObjectId(commentidd) }}}, function(err, result) {
            console.log(err) 
           // console.log(result) 
              if (err!=null) {
                console.log('lkkll')
                res.status(401).json({error:'An error has occurred'});
              } else{
                res.status(200).json({
                  result:"success",
                  message:"Updated"
              });
             
              }
              
          })
       }
    }
    }
    })
})



//add varients
router.post('/addvarient/:itemcatid',checkAuth,(req,res,next)=>{
  const itemcatid=req.params.itemcatid
  const varientOfItemCat= {
    varientid:mongoose.Types.ObjectId(),
    userid:req.body.userid,
    varientname:req.body.varientname,
    price:req.body.price, 
};

ItemCategories.find({ "_id": itemcatid},  function(err, result) {
  if (err) {
      res.send({'error':result});
  } else {
    //var commentlen=result[0].commentsofusers.length;
      ItemCategories.updateOne({ "_id": itemcatid}, {$addToSet: { "varients" :  varientOfItemCat}}, function(err, result) {
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



//get delete varients itemcategory
router.get('/deletevarients/:itemcatid/varientid/:varientid',checkAuth,(req,res,next)=>{
console.log(req.params.commentid)
const itemcatid=req.params.itemcatid
const varientidd=req.params.varientid

  ItemCategories.find({ "_id": itemcatid},  function(err, result) {
    if (err) {
      res.send({'error':result});
  } else {
    console.log(result[0])
    //  var commentlen=result[0].commentsofusers.length;
     for(var i=0; i<result[0].varients.length;i++){
      if(result[0].varients [i].varientid==varientidd){
        ItemCategories.updateOne({"_id": itemcatid}, {$pull: { "varients" :  { varientid: mongoose.Types.ObjectId(varientidd) }}}, function(err, result) {
          console.log(err) 
         // console.log(result) 
            if (err!=null) {
              console.log('lkkll')
              res.status(401).json({error:'An error has occurred'});
            } else{
              res.status(200).json({
                result:"success",
                message:"Updated"
            });
           
            } 
        })
     }
  }

  }

  })

})


//delete itemCategory
router.get('/deleteItemsCat/:itemCatid',checkAuth,(req,res,next)=>{
  const itemCatid=req.params.itemCatid

  ItemCategories.remove({ "_id": itemCatid}, function(err, result) {
    if (err!=null) {
        res.status(200).json({error:'An error has occurred'});
      } else {
               res.status(200).json({
                    result:"success",
                    message:"Deleted all menu categories"
                });
      }
});


  // ItemsNames.remove({ "_id": itemid}, function(err, result) {
  //     if (err!=null) {
  //         res.status(200).json({error:'An error has occurred'});
  //       } else {
  //       }
  // });
  
});







module.exports=router;