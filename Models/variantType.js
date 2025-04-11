const mongoose=require('mongoose');

//define variant schema

const variantTypeSchema= mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
},{
    timestamps: true,
});

 module.exports=mongoose.model("variantType",variantTypeSchema);
