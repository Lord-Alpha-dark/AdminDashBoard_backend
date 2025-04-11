const mongoose=require('mongoose');

//creating Schema for adding brands 
const brandSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is required"],//custom err message
    },
    subCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'subCategory',//this should use model name
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('brand', brandSchema);
