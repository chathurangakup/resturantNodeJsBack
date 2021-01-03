const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'users',require:true},
    randomid:{type:String,require:true},
    cartitems:{type:Array,require:true},
    status:{type:String,require:true},
    type:{type:String,require:true},
    date:{type:String,require:true},
    time:{type:String,require:true},
    address:{type:String,require:true},
    totalprice:{type:String,require:true},
    isdisplay:{type:Boolean,require:true},
    

  
})

module.exports = mongoose.model('cart', dataSchema);