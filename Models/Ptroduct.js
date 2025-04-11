const mongoose= require('mongoose');
const variantType = require('./variantType');

const ProductSchema= mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: { 
        type: Number, 
        required: true 
    },
    Category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    subCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'subCategory',  // Reference to the subCategory model
        required: true,
    },
    Brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    
    variantType:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'variantType',  // Reference to the variantType model
        required: true,
    },
    variant:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'variant',  // Reference to the variant model
        required: true,
    }],
    images:[{
        image:{
            type: Number,
            required: true,
        },
        url:{
            type: String,
            required:true,
        }
    }],
},{
    timestamps: true,
});

module.exports=mongoose.model('Product',ProductSchema);
