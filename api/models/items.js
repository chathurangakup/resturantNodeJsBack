const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    itemname:{type:String,require:true},
    categotyitems:{type:Array,require:true},
  
})

module.exports = mongoose.model('items', dataSchema);