const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    itemid:{type:mongoose.Schema.Types.ObjectId,ref:'items',require:true},
    categoryname:{type:String,require:true},
    varients:{type:Array,require:true},
    comments:{type:Array,require:true},
    price:{type:String,require:true},
    description:{type:String,require:true},
    image:{type:String,require:true},
    isLike:{type:Boolean,require:true},
  
})

module.exports = mongoose.model('itemcategories', dataSchema);