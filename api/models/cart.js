const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'users',require:true},
    cartitems:{type:Array,require:true},
    status:{type:String,require:true},
    type:{type:String,require:true},
    totalprice:{type:String,require:true},
    

  
})

module.exports = mongoose.model('cart', dataSchema);