const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');
const { uploadCategory } = require('../uploadFile');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


// Get all categories
router.get('/', async function (req, res) {
    try {
        const categories = await Category.find();
        res.json({ message: "Categories retrieved successfully", data: categories });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async function (req, res) {
    try {
        const categoryID = req.params.id;
        const category = await Category.findById(categoryID);

        if (!category) {
            res.status(404).json({ message: error.message });
        }
        res.json({ message: "category retrieved successfully", data: category });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//create
router.post('/create', uploadCategory.single('image'), async function (req, res) {
    const { name } = req.body;
    const image = req.file ? `https://admindashboard-backend-gzfl.onrender.com/image/category/${req.file.filename}` : null;
    console.log(req.file);
    // Validate the incoming data
    if (!name || !image) {
        res.status(400).json({ success: false, message: "Name and image are required." });
    }
    try {
        //create new category instance
        const newCategory = new Category({ name, image });
        await newCategory.save();
        res.json({ success: true, message: "category created successfully", data: newCategory });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
//update by id
router.put('/update/:id', uploadCategory.single('image'), async function (req, res) {
    const { name } = req.body;//we can just use const { name } = req.body; because if name isn't provided, it'll simply be undefined
    const image = req.file ? `https://admindashboard-backend-gzfl.onrender.com/image/category/${req.file.filename}` : null;
    if (!name || !image) {
        res.status(400).json({ error: error.message });
    }
    try {
        //find category by id
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'category not found' });
        }

        if (image) category.image = image;
        if (name) category.name = name;
        // Save the updated category
        await category.save();
        res.json({ message: "Category updated successfully", category });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/delete/:id', async function (req, res) {
    try {


        // Find the category by ID and delete it
        const category = await Category.findByIdAndDelete(req.params.id);

        //if the category not exist
        if (!category) {
            return res.status(404).json({ message: 'category not found' });

        }
        const imagepath = category.image;
        const filename = path.basename(imagepath);
        //used ".." to move outward from routes folder in path
        const filepath = path.join(__dirname, '..', 'public', 'category', filename);

        fs.unlink(filepath, function (error) {
            if (error) {

                return res.status(200).json({ success: true, message: "Category deleted successfully.", error: error.message });
            }
            else {
                return res.json({ success: true, message: "Category deleted successfully with img." });
            }
        })

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

