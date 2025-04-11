const mongoose= require('mongoose');

const OrderSchema= mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    orderDate :{
        type: Date,
        default: Date.now,
        required: true,
    },
    orderStatus: {
        type: String,
        enum:['Pending','Processing','Shipped','Delivered','Cancelled'],
        default:'Pending',
        required:true,
    },
    items:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true, 
        },
        productName:{
            type:String,
            required:true,
        },
        quantity:{
            type: Number,
            required: true,
        },
        price:{
            type: Number,
            required: true,
        },
        variant: {
            type: String,
          },
    }],
    orderTotal: {
        subtotal: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    shippingAddress:{
        phone: String,
        street: String,
        city: String,
        State: String,
        country: String,
        postalCode: String,

    },
    paymentMethod:{
        type: String,
        enum:['COD','Prepaid'],
        required: true
    },
    couponCode:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Coupon',
    },
    
    trackingUrl:{
        type:String,

    }
    
});

module.exports=mongoose.model('Order',OrderSchema);