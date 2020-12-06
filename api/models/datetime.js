const mongoose = require("mongoose");

const dataSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    dayname:{type:String,require:true},
    openhours:{type:Number,require:true},
    closehour:{type:Number,require:true},
    status:{type:String,require:true},
 
    

  
})

module.exports = mongoose.model('datetime', dataSchema);