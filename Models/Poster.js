const mongoose=require('mongoose');

const PosterSchema=mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    imageUrl:{
        type:String,
        required: true,
    }
},{
    timestamps: true,
});

module.exports= mongoose.model('Poster',PosterSchema);