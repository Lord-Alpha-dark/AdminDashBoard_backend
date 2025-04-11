const express= require('express');
const router=express.Router();
const Brand=require('../Models/Brand');
const SubCategory= require('../Models/subCategory');
const Product= require('../Models/Ptroduct');

// Get all brands
router.get('/',async function (req, res) {
    try {
        const brands = await Brand.find().populate('subCategory').sort({'subCategory': 1});
        if(!brands)
            {
                return res.json({message:"no brand"});
            }
        res.json({ success: true, message: "Brands retrieved successfully.", data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get a brand by ID
router.get('/:id',async function (req, res){
    try {
        const brandID = req.params.id;
        const brand = await Brand.findById(brandID).populate('subCategory');
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found." });
        }
        res.json({ success: true, message: "Brand retrieved successfully.", data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a new brand
router.post('/create', async function(req, res){
    const { name, subCategory} = req.body;
    if (!name || !subCategory) {
        return res.status(400).json({ success: false, message: "Name and subcategory ID are required." });
    }

    try {
        const brand = new Brand({ name, subCategory });
         await brand.save();
         const populatedBrand= await Brand.findById(brand._id).populate('subCategory');
         console.log(populatedBrand);
        res.json({ success: true, message: "Brand created successfully.", data: populatedBrand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/update/:id',async function(req,res){
    const brandId=req.params.id;
    const {name, subcategoryId} = req.body;
    try {
        const brand= await Brand.findById(brandId);
        if(!brand)
        {
            return res.status(404).json({ success: false, message: "brand not found." });
        }
        if(name) brand.name=name;
        if(subcategoryId) brand.subCategory=subcategoryId;
        await brand.save(); 
        res.json({ success: true, message: "brand updated successfully.", data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a brand
router.delete('/:id', async function(req, res){
    const brandID = req.params.id;
    try {
        // Check if any products reference this brand
        const products = await Product.find({ proBrandId: brandID });
        if (products.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete brand. Products are referencing it." });
        }

        // If no products are referencing the brand, proceed with deletion
        const brand = await Brand.findByIdAndDelete(brandID);
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found." });
        }
        res.json({ success: true, message: "Brand deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;
