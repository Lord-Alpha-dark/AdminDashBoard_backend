const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

const adminschema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate:{
            validator: (value)=>{
                const re=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                return value.match(re);
            },
            message: 'Please enter a valid email address'

        }
    },
    password:{
        type: String,
        required: true,
        unique: true,
        minLength: 6,
    },
},{
    timestamps: true,
});

module.exports=mongoose.model('Admin',adminschema);
