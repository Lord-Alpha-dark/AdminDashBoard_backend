/*The GitKeep Generator is a Visual Studio Code extension developed by Harsh Vandana Sharma. Designed to automate the
 creation of .gitkeep files in empty directories within your project, it leverages the .gitignore file to determine which
  directories are considered empty and thus require a .gitkeep file. This process helps maintain a clean and organized repository structure, ensuring that all directories tracked by Git are intentional. */

  
const express=require("express");
const app=express();
const asyncHandler=require('express-async-handler');
//const db=require('./config/mongoose-connection');
const dotenv= require('dotenv');
const mongoose = require('mongoose');
const cors=require('cors');
dotenv.config();
app.use(express.json());
app.use(cors({origin:'*'})); // Enable CORS for all routes for any origin

const URL = process.env.MONGO_URL;
mongoose.connect(URL).then(()=>console.log("connection successful"))
.catch((error)=>console.log("connection failed", error));

//? setting static folder path
app.use('/image/poster', express.static('public/Poster'));
app.use('/image/product', express.static('public/Product'));
app.use('/image/category', express.static('public/category'));

app.use(cors({origin:'*'})); // Enable CORS for all routes for any origin
//routes
app.use('/Brand', require('./Routes/Brand'));
app.use('/Category', require('./Routes/Category'));
app.use('/Coupon',require('./Routes/Coupon'));
app.use('/Notification', require('./Routes/Notification'));
app.use('/Order', require('./Routes/order'));
app.use('/Poster', require('./Routes/Poster'));
app.use('/Product', require('./Routes/Product'));
app.use('/subCategory', require('./Routes/subCategory'));
app.use('/user', require('./Routes/user'));
app.use('/Variant', require('./Routes/variant'));
app.use('/VariantType', require('./Routes/variantType'));
app.use('/auth',require('./Routes/authentication'));

// Example route using asyncHandler directly in app.js
app.get('/', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'API working successfully', data: null });
}));

// Global error handler
app.use((error, req, res, next) => {
  res.status(500).json({ success: false, message: error.message, data: null });
});

const port = process.env.PORT || 3000;
app.listen(port,"0.0.0.0", () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });