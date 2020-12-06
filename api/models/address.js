const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'users',require:true},
    address:{type:String,require:true},
    isdefault:{type:Boolean,require:true},
 
    

  
})

module.exports = mongoose.model('address', dataSchema);