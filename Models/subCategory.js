const mongoose=require('mongoose');

const subCategorySchema=new mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
    CategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',  // Reference to the Category model
        required: true,
    }

},{
    timestamps: true
})

module.exports= mongoose.model('subCategory',subCategorySchema);