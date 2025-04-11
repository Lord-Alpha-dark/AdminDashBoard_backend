const express=require('express');
const router=express.Router();
const Notification=require('../Models/Notification');
const OneSignal = require('onesignal-node');

router.get('/',async function(req,res){
    try{
        //sorting in descending order. (recents one have larger ids)
        const notify=await Notification.find().sort({_id:-1});
        return res.json({message:"notifications retrieved successfully",data: notify});
    }
    catch(error)
    {
       return res.status(500).json({error: error.message});
    }
    
});

router.get('/:id',async function(req,res){
    try{
      const notify =await Notification.findById(req.params.id);
      if(!notify)
        {
         res.status(404).json({message: error.message});
        }
        res.json({message:"notification retrieved successfully",data: notify});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

   const client =new OneSignal.Client(process.env.ONE_SIGNAL_APP_ID,process.env.ONE_SIGNAL_REST_API_KEY);
router.post('/send-notification', async function(req,res){
    try{
        const {Title,Description, imageUrl}=req.body;
         const Notificationbody= {
            contents:{
                'en': description
            },
            headings:{
                'en': Title
            },
            included_segments:['All'],
            ...(imageUrl && {big_picture: imageUrl})
         };

         const response= client.createNotification(Notificationbody);
         const notificationid=response.body.id;
         console.log("notification sent to all users",notificationid);
         const notification=new Notification({notificationid,Title,Description,imageUrl});
         const newNotification = await notification.save();
         res.json({success : true, message:"notification successfully sent"})

    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

router.delete("/delete-notification/:id", async function(req,res){
    try{
        const notifi_id=req.params.id;
        const notification= await Notification.findByIdAndDelete(notifi_id);
        if(!notification)
        {
            return res.status(404).json({message: "notification not found"});
        }
        return res.json({ success: true, message: "Notification deleted successfully.",data:null });

    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
} );

module.exports= router;
