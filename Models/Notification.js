const mongoose=require('mongoose');

const NotificationSchema= mongoose.Schema({
    notificationId: {
        type: String,
        required: [true, 'Notification ID is required'],
        unique: true
    },
    Title:{
        type:String,
        required: true,
    },
    Description:{
        type:String,
        required: true,
    },
    imageUrl:{
        type:String,
        required: true,
    }
},{
    timestamps: true,
});

module.exports=mongoose.model('Notification',NotificationSchema);