const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'users',require:true},
     itemcategoryid:{type:mongoose.Schema.Types.ObjectId,ref:'Itemcategories',require:true},
     islike:{type:Boolean,require:true},
    
  
})

module.exports = mongoose.model('likes', dataSchema);
