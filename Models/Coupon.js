const mongoose=require('mongoose');

const  CouponSchema= mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    DiscountType:{
        type:String,
        enum: ['fixed','percentage'],
        required: true,
    },
    discountAmount: {
        type: Number,
        required: true
      },
    minimumPurchaseAmt:{
        type:Number,
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: 'active',
    },
    endDate:{
        type: Date,
        required: true
    },
    Category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    subCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'subCategory',
    },
    applicableProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
},
{
    timestamps: true,
});

module.exports=  mongoose.model('Coupon', CouponSchema);