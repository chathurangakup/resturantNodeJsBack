const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const Users = require('../models/users');
const checkAuth=require('../middleware/check-auth');

const saltRounds = 10;

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// router.post('/login',(req,res,next)=>{
//     const users=new Users({
//         _id:new mongoose.Types.ObjectId(),
//         username:req.body.username,
//         email:req.body.email
//     });
//     users.save().then(
//         result=>{
//             res.status(201).json({
//                 message:'Post request',
//                 result:result
//             })
//             // console.log(result)
//         }
//     ).catch(err=>console.log(err))
  
// });

//login api
router.post('/login',(req,res,next)=>{
 
    Users.find({email:req.body.email}).exec().then(user=>{
      console.log(user.length)
        if(user.length<1){
            return res.status(401).json({
              result:"error",
              message:'Still no account please signin'
            })
        }else{
            if(user[0].isverify==true){
              bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                console.log(result);
                console.log(user[0])
    
                 if(result){
                      const token=jwt.sign({
                       email:user[0].email,
                       userId:user[0]._id
                      }, 'secret', 
                      { expiresIn: 60 * 60 * 1000 
                      });


                      return res.status(201).json({
                        result:"success",
                        message:'Auth Successful',
                        token:token,
                        email:user[0].email,
                        userId:user[0]._id,
                        image:user[0].image,
                        username:user[0].username
                      })
                    }else{
                      return res.status(401).json({
                        result:"error",
                        message:'Please chek email or password'
                      })
                    }
                  });
               }else{

             
                  console.log(req.body.password)
                  bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                    console.log(result)
                    console.log(user[0].password)
                     if(result){
                          const token=jwt.sign({
                           email:user[0].email,
                           userId:user[0]._id
                          }, 'secret', 
                          { expiresIn: 60 * 60 * 1000
                          });
  
  
                          return res.status(201).json({
                            result:"success",
                            message:'Auth Successful',
                            token:token,
                            email:user[0].email,
                            userId:user[0]._id,
                            image:user[0].image,
                            username:user[0].username
                          })
                        }else{
                          return res.status(401).json({
                            result:"error",
                            message:'Please chek email or password'
                          })
                        }
                      });

                               
               }
        }
    });
  

});






//signup
router.post('/signup',(req,res,next)=>{
    console.log(req.body.email)
    const addpassword=req.body.password
    if(req.body.email==undefined){
      res.status(401).json({
        result:"error",
        message:"need email in body"
       });
    }else{

      Users.find({email:req.body.email}).exec().then(result=>{
        console.log(result)
        if(result.length >=1){
        
                      res.status(200).json({
                        result:"success",
                        status:"exists",
                        message:"User already Exists You can Log now",
                        createPro:{}
                    });
                // if( result[0].password!=''){
    
                //   }else if( result[0].verify==false || result[0].password==''){    
                  var verify=Math.floor(Math.random() * 1000000)+1
                //   Users.update(
                //       {"email":req.body.email},
                //       {$set:{"verifyCode":verify}}
                //   )
                // .exec()
                // .then(docs=>{
                //   if(docs){

                    // bcrypt.hash(addpassword, saltRounds, function(err, hash) {
                    //     if(err){
                    //         res.status(401).json({
                    //             result:"error",
                    //             message:"password error"
                    //         }); 
                    //     }else{
                    //         console.log("success")
                    //         const user=new Users({
                    //             _id: new mongoose.Types.ObjectId(),
                    //             firstName: req.body.firstName,
                    //             lastName:result.body.lastName,
                    //             faculty:result.body.faculty,
                    //             gender:result.body.gender,
                    //             email:result.body.email,
                    //             password:hash,
                    //             date:req.body.date
                    //         });
                    //         res.status(200).json({
                    //              result:"success",
                    //              status:"update",
                    //              message:"User already exists but not Password",
                    //              createPro:user
                    //         });
                          
                    //     }
                    // })
                     



                  
                     
                //     }else{
                //       res.status(404).json({
                //          result:"success",
                //          status:"novalidvalue",
                //          message:"No valid value"
                //       });
                //     }
                //   }).catch(err=>{
                //       console.log(err)
                //    });     
                    
          
        }else{

          //   var verify=Math.floor(Math.random() * 1000000)+1

          //  console.log(verify)

          // client.messages
          // .create({
          //   from: '+18329900782',
          //   to: '+94774604575',
          //   body: 'ggghhg',
          // })
          // .then(message => console.log(message+"djhsjh"));

           bcrypt.hash(addpassword, saltRounds, function(err, hash) {
            if(err){
                res.status(401).json({
                    result:"error",
                    message:"password error"
                }); 
            }else{

              const user=new Users({
                _id: new mongoose.Types.ObjectId(),
                firstName: req.body.firstName,
                lastName:req.body.lastName,
                phoneno:req.body.phoneno,
                email:req.body.email,
                password:hash,
                date:req.body.date
      
               
              });
              user.save()
              .then(docs=>{
                  if(docs){
                    res.status(201).json({
                        result:"success",
                        status:"create",
                        message:"Succesfully email has created",
                        createPro:user
                      }) 
                  }  
            }).catch(err=>{
              console.log(err)
            });
             
                
               
            }
        })
          
            
        }
    })
    }
  });



  router.get('/usrdetails/:id',checkAuth,(req,res,next)=>{
    const useridd=req.params.id


    Users.aggregate([
  {
      $lookup: {
        from: "addresses",
        as: "addresses",
        // localField: "_id",
        // foreignField: "itemcategoryid",
        let:{isdefault:true,userid:useridd},
        pipeline:[
            {$match:{
              $expr:{$eq: ['$isdefault', "$$isdefault"]},
            }},
            {$match:{
              $expr:{$eq: ['$userid',mongoose.Types.ObjectId(useridd)]},
            }},
        ],
       
    },

  },
//   { 
//      $lookup:{
//       from: "addresses",       // other table name
//       localField: "_id",   // name of users table field
//       foreignField: "userid", // name of userinfo table field
//       as: "addresses"         // alias for userinfo table
//   }
// },


      {
         "$match":{"_id":mongoose.Types.ObjectId(useridd)}
      },
    {  $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email:1,
        phoneno:1,
        addresses: "$addresses.address" ,
       
   
      }}
  ],  function(err, result){
      //  res.status({result})
      //     if(user.length<1){
      //       return res.status(401).json({
      //         result:"error",
      //         message:'Still no account please signin'
      //       })
      //   }else{
      //    console.log(user[0])
      //    return res.status(201).json({
      //     result:"Success",
      //     message:'',
      //     data:user[0]
         
      //   })
      //   }
        res.status(200).json({result});
     
 });
  });


  //update users
 router.post('/updateuserdetails',(req,res,next)=>{
  const userid=req.body.userid
  const addpassword=req.body.password
  
  Users.find(
      {"_id":userid},  
  )
.exec()
.then(docs=>{
    
    if(docs){
       bcrypt.hash(addpassword, saltRounds, function(err, hash) {
         if(err){
          res.status(401).json({
              result:"error",
              message:"uerdetails error"
          }); 
         }else{
          Users.update(
              {"_id":userid},
              {$set: {
                "firstName":req.body.firstName,
                "lastName":req.body.lastName,
                "phoneno":req.body.phoneno,
                "password":hash
              }}
          )
        .exec()
        .then(docs=>{
          if(docs){
             
             //consolele.log("kki")
              res.status(200).json({
                   result:"success",
                  message:"updated user details"
              });
            }else{
              res.status(404).json({message:"No valid value"});
            }
          }).catch(err=>{
              console.log(err)
            });
       
          }
      });
     
    }else{
      res.status(404).json({message:"No valid value"});
    }
    }).catch(err=>{
        console.log(err)
   });
});



module.exports=router;