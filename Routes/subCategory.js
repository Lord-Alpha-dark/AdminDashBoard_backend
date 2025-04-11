const express=require('express');
const router=express.Router();
const SubCategory=require('../Models/subCategory');
const Brand= require('../Models/Brand');
const Product = require('../Models/Ptroduct');


/*The .populate() function uses the ref value to look up the referenced Category document and include its data in the result.
 */
router.get('/',async function(req,res) {
    try {
        const subcategories= await SubCategory.find().populate('CategoryId').sort({'CategoryId': 1});//Sorts the retrieved subcategories by the categoryId field in ascending order.
        if(!subcategories)
        {
            return res.json({message:"no sub category"});
        }
        res.json({ success: true, message: "Sub-categories retrieved successfully.", data: subcategories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const subCategoryID = req.params.id;
        const subCategory = await SubCategory.findById(subCategoryID).populate('categoryId');
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }
        res.json({ success: true, message: "Sub-category retrieved successfully.", data: subCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/create', async function(req,res){
    const { name, CategoryId } = req.body;
    if (!name || !CategoryId) {
        return res.status(400).json({ success: false, message: "Name and category ID are required." });
    }
    try {
        const subCategory = new SubCategory({ name, CategoryId });
         await subCategory.save();
        const populatedSubCategory=await SubCategory.findById(subCategory._id).populate("CategoryId");
        res.json({ success: true, message: "Sub-category created successfully.", data: populatedSubCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/update/:id',async function(req,res){
    const subcategoryId=req.params.id;
    const {name, CategoryId} = req.body;
    try {
        const subcat= await SubCategory.findById(subcategoryId);
        if(!subcat)
        {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }
        if(name) subcat.name=name;
        if(CategoryId) subcat.CategoryId=CategoryId;
        await subcat.save();
        res.json({ success: true, message: "Sub-category updated successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

 router.delete('/:id',async function(req ,res){
    const subcategoryId= req.params.id;

    try{
      const brandCount= await Brand.countDocuments({subCategory: subcategoryId});
      if(brandCount>0)
      {
        return res.status(400).json({ success: false, message: "Cannot delete sub-category. It is associated with one or more brands." });
       
      }
      const productcount= await Product.countDocuments({subCategory: subcategoryId});
      if(productcount>0)
      {
        return res.status(400).json({ success: false, message: "Cannot delete sub-category. Products are referencing it." });
      
      }
       // If no brands or products are associated, proceed with deletion of the sub-category
      const deletedsubCategory = await SubCategory.findByIdAndDelete(subcategoryId);
      if (!deletedsubCategory) {
          return res.status(404).json({ success: false, message: "subcategory not found." });
      }
      res.json({ success: true, message: "subcategory deleted successfully." });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
 })

 module.exports = router;