const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName:{type:String,require:true},
    lastName:{type:String,require:true},
    email:{type:String,require:true},
    phoneno:{type:String,require:true},
    password:{type:String,require:true},
    date:{type:String,require:true},
    
  
})

module.exports = mongoose.model('users', dataSchema);
