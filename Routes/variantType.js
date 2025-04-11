const express=require('express');
const router=express.Router();
const VariantType= require('../Models/variantType');
const Product = require('../Models/Ptroduct');
const Variant = require('../Models/variant');

router.get('/',async function(req, res){
    try {
        const variantTypes = await VariantType.find();
        res.json({ success: true, message: "VariantTypes retrieved successfully.", data: variantTypes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id',async function(req, res) {
    try {
        const variantTypeID = req.params.id;
        const variantType = await VariantType.findById(variantTypeID);
        if (!variantType) {
            return res.status(404).json({ success: false, message: "VariantType not found." });
        }
        res.json({ success: true, message: "VariantType retrieved successfully.", data: variantType });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

});

router.post('/create',async function(req, res){
    const { name} = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required." });
    }

    try {
        const variantType = new VariantType({ name});
        await variantType.save();
        res.json({ success: true, message: "VariantType created successfully.", data: variantType });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', async function(req, res){
    const variantTypeID = req.params.id;
    const { name} = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required." });
    }

    try {
        const updatedVariantType = await VariantType.findByIdAndUpdate(variantTypeID, { name}, { new: true });
        if (!updatedVariantType) {
            return res.status(404).json({ success: false, message: "VariantType not found." });
        }
        res.json({ success: true, message: "VariantType updated successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a variant type
router.delete('/delete/:id',async function(req, res){
    const variantTypeID = req.params.id;
    try {
        // Check if any variant is associated with this variant type
        const variantCount = await Variant.find({ variantTypeId: variantTypeID });
        if (variantCount.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete variant type. It is associated with one or more variants." });
        }
        
        // Check if any products reference this variant type
        const products = await Product.find({ proVariantTypeId: variantTypeID });
        if (products.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete variant type. Products are referencing it." });
        }

        // If no variants or products are associated, proceed with deletion of the variant type
        const variantType = await VariantType.findByIdAndDelete(variantTypeID);
        if (!variantType) {
            return res.status(404).json({ success: false, message: "Variant type not found." });
        }
        res.json({ success: true, message: "Variant type deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
