const express=require('express');
const Coupon=require('../Models/Coupon');
const Product=require('../Models/Ptroduct');
const router = express.Router();


router.get('/', async function(req,res){
    try {
        const coupons = await Coupon.find();
        res.json({message: "Coupons retrieved successfully", data: coupons});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const couponID = req.params.id;
        const coupon = await Coupon.findById(couponID);
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }
        res.json({ success: true, message: "Coupon retrieved successfully.", data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/create',async function(req,res){
    const {name,DiscountType,discountAmount,minimumPurchaseAmt,status,endDate,Category,subCategory,applicableProduct}= req.body;
    if(!name  || !DiscountType || !discountAmount || !status || !endDate)
    {
        return res.status(400).json({ success: false, message: "name, discountType, discountAmount, endDate, and status are required." });
    }

    try {
        const couponcode=new Coupon({name,DiscountType,discountAmount,minimumPurchaseAmt,
            status,endDate,Category,subCategory,applicableProduct
        });
        await couponcode.save();
        res.json({message:"coupon created successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//to update a coupon

router.put('/update/:id',async function(req,res){
    const couponID = req.params.id;
    const {name,DiscountType,discountAmount,minimumPurchaseAmt,status,endDate,Category,subCategory,applicableProduct}= req.body;
    if(!name  || !DiscountType || !discountAmount || !status || !endDate)
    {
        return res.status(400).json({ success: false, message: "name, discountType, discountAmount, endDate, and status are required." });
    }
    try{
        const updatedcoupon = await Coupon.findByIdAndUpdate(couponID,{name,DiscountType,discountAmount,minimumPurchaseAmt,status,endDate,Category,subCategory,applicableProduct},
            {new: true}
        );
        if(!updatedcoupon)
        {
            res.status(404).json({message:'category not found'});
        }
       
    }
    catch(error){
        res.status(500).json({message: error.message}); 
    }

});

//delete a coupon
router.delete('/delete/:id',async function(req,res){
    try{
     //find coupon by id and delete
   const couponcode= await Coupon.findByIdAndDelete(req.params.id);

   if(!couponcode)
   {
    return res.status(404).json({ success: false, message: "Coupon not found." });
   }   
   res.json({ success: true, message: "Coupon deleted successfully." });
    }
    catch(error){
     res.status(500).json({message: error.message});
    }
});

router.post('/check-coupon',async function(req,res){
    try{
       const {name,productIds,purchaseamt} = req.body;
        const couponcode= new Coupon.findOne({name});

         // If coupon is not found, return false
         if (!coupon) {
            return res.json({ success: false, message: "Coupon not found." });
        }
        
        // Check if the coupon is expired
        const currentDate = new Date();
        if(currentDate>endDate)
        {
           return res.json({message: "coupon is expired"});
        }

         //check if coupon is inactive
        if(couponcode.status!='active')
        {
           return  res.json({message: "coupon is inactive"});
        }
        
        //check if the purchaseamount is greater then minimumpurchaseamount 
        if(purchaseamt< couponcode.minimumPurchaseAmt)
        {
            return  res.json({message: "minimum Purchase amount not met"});
        }

        //check if the coupon is available for all orders or not
        if(!couponcode.Category && !couponcode.subCategory && !couponcode.applicableProduct)
        {
            return  res.json({message: "available for all orders",data: couponcode});
        }
        // Fetch the products from the database using the provided product IDs
        const products= await Product.find({_id:{ $in: productIds}});

        const isvalid=products.every(product=>{
            if(couponcode.Category && couponcode.Category.toString()!==product.Category.toString())
            {
                return false;
            }
            if(couponcode.subCategory && couponcode.subCategory.toString()!==product.subCategory.toString())
                {
                    return false;
                }
           if(couponcode.applicableProduct && couponcode.applicableProduct.toString()!==product.subCategory.toString())
                {
                    return false;
                }
                return true;
        })
        if(isvalid)
            {
             return res.json({success: true,message: "coupon is applicable for the provided products",data: couponcode});
            }
            else{
                return res.json({message:"coupon is not available for the provided products"});
            }
    }
    catch(error){
        console.error("error occured during checking coupon",error);
         return res.status(500).json({error: error.message});
    }
});

module.exports=router;