const express=require('express');
const multer=require('multer');
const path=require('path');
const router=express.Router();
//const  Category= require('./Models/Category');


// Set up multer for file storage
const storageCategory = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(`Uploading file: ${file.originalname} to destination: ./public/category`);
      cb(null, './public/category')
    },
    filename: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (extname) {
          console.log(`Saving file as: ${Date.now()}_${file.originalname}`);
          cb(null, Date.now() + "_" + file.originalname);
        } else {
          cb("Error: only .jpeg, .jpg, .png files are allowed!");
        }
    }
  });

  // Initialize multer with the storage configuration
const uploadCategory = multer({
  storage: storageCategory,
 limits: {
   fileSize: 1024 *1024*5
 } ,
});
  
  const storagePoster = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/Poster')
    },
    filename: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (extname) {
          cb(null, Date.now() + "_" + file.originalname);
        } else {
          cb("Error: only .jpeg, .jpg, .png files are allowed!");
        }
    }
  });


const uploadPoster=multer({
  storage: storagePoster,
  limits: {
    fileSize: 1024*1024*5
  },
});

const storageProduct = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/Product');
  },
  filename: function(req, file, cb) {
    // Check file type based on its extension
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      console.log(`Saving file as: ${Date.now()}_${file.originalname}`);
      cb(null, Date.now() + "_" + file.originalname);
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  }
});

const uploadProduct = multer({
  storage: storageProduct,
  limits: {
    fileSize: 1024 * 1024 * 5 // limit filesize to 5MB
  },
});
module.exports = {
  uploadCategory,
  uploadPoster,
  uploadProduct,
};
