const express= require('express');
const router=express.Router();
const Product= require('../Models/Ptroduct');
const {uploadProduct} = require('../uploadFile');
const mongoose = require('mongoose');
const fs=require('fs').promises;
const path=require('path');

router.get('/', async function(req, res){
    try {
        const products = await Product.find()
        .populate('Category', 'id name')
        .populate('subCategory', 'id name')
        .populate('Brand', 'id name')
        .populate('variantType', 'id name');
        res.json({ success: true, message: "Products retrieved successfully.", data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async function(req, res){
    try {
        const productID = req.params.id;
        const product = await Product.findById(productID)
        .populate('Category', 'id name')
        .populate('subCategory', 'id name')
        .populate('Brand', 'id name')
        .populate('variantType', 'id name')
        .populate('variant', 'id name');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product retrieved successfully.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/create',uploadProduct.fields([ { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },]), async function(req,res){
    try {
        const {name, description,quantity,price, Category,subCategory, Brand,variantType,variant}=req.body;
        // Validate required fields
        if (!name || !description ||!quantity || !price || !Category || !subCategory  || !variantType || !variant) {
            return res.status(400).json({ message: "Required fields are missing." });
        }
         // Collect uploaded image URLs
         const imageUrls = [];
         ['image1', 'image2', 'image3', 'image4'].forEach(function(field,index){
            if(req.files[field]  && req.files[field].length > 0)
            {
                const file= req.files[field][0];
                imageUrls.push({image: index+1,url:  `https://admindashboard-backend-gzfl.onrender.com/image/product/${file.filename}`})
            }
         });
         let variantIds;
        if (typeof variant === 'string') {
         variantIds = [variant];
        } 
        else if (Array.isArray(variant)) {
            variantIds = variant;
          }
         const Variantids=variantIds.map(v=> new mongoose.Types.ObjectId(v));
        // Create and save a new product
        const newProduct = new Product({
            name,
            description,
            quantity,
            price,
            Category,
            subCategory,
            Brand,
            variantType,
            variant:Variantids,
            images: imageUrls
        });

   // Save the new product to the database
   await newProduct.save();
   const populatedProduct= await Product.findById(newProduct._id).populate('Category').populate('subCategory').populate('Brand').populate('variantType');
   // Send a success response back to the client
  
   res.json({ success: true, message: "Product created successfully.", data: populatedProduct });

} catch (error) {

res.status(500).json({ success: false, message: error.message });
}
});

router.put('/update/:id', uploadProduct.fields([
   { name: 'image1', maxCount:1},
   { name: 'image2', maxCount:1},
   { name: 'image3', maxCount:1},
   { name: 'image4', maxCount:1},
   { name: 'image5', maxCount:1},]),async function(req,res){
    try{
        const productId=req.params.id;
        const {name, description,quantity,price, Category,subCategory, Brand,variantType,variant}=req.body;

         // Collect uploaded image URLs
         const imageUrls = [];
         ['image1', 'image2', 'image3', 'image4', 'image5'].forEach(function(field,index){
            if(req.files[field]  && req.files[field].length > 0)
            {
                const file= req.files[field][0];
                imageUrls.push({image: index+1,url:  `https://admindashboard-backend-gzfl.onrender.com/image/product/${file.filename}`})
            }
         });
         // Find the product by ID
         const productToUpdate = await Product.findById(productId);
         if (!productToUpdate) {
             return res.status(404).json({ success: false, message: "Product not found." });
         };

         if(name)productToUpdate.name=name;
         if(description)productToUpdate.description=description;
         if(quantity)productToUpdate.quantity=quantity;
         if(price)productToUpdate.price=price;
         if(Category)productToUpdate.Category=Category;
         if(subCategory)productToUpdate.subCategory=subCategory;
         if(Brand)productToUpdate.Brand=Brand;
         if(variantType)productToUpdate.variantType=variantType;
         if(variant)productToUpdate.variant=variant;
         productToUpdate.image=imageUrls;

         await productToUpdate.save();

         await productToUpdate.save();
         res.json({ success: true, message: "Product updated successfully." });
    
 } catch (error) {
     console.error("Error updating product:", error);
     res.status(500).json({ success: false, message: error.message });
 }
});

router.delete('/delete/:id',async function(req, res){
    const productID = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(productID);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        product.images.forEach(async function(field){
           const imagepath=field.url;
           const filename=path.basename(imagepath);
           const filepath=path.join(__dirname,'..','public','product',filename);
           try {
            await fs.unlink(filepath); // Delete the file
            
          } catch (error) {
            
            throw new Error(`Failed to delete image ${filename}: ${error.message}`);
          }
        });
        res.json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

