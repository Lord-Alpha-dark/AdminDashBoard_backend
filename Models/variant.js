const mongoose=require('mongoose');

//define variant schema

const variantSchema= mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
    variantTypeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'variantType',
        required: true,
    }

},{
    timestamps: true,
});

 module.exports=mongoose.model("variant",variantSchema);
