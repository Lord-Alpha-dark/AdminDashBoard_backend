const express=require('express');
const Poster=require('../Models/Poster');
const router= express.Router();
const {uploadPoster}= require('../uploadFile');



router.get('/',async (req, res) => {
    try {
        const posters = await Poster.find({});
        res.json({ success: true, message: "Posters retrieved successfully.", data: posters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/:id',async function(req,res){
  try {
    const poster=Poster.findById(req.params.id);
    if (!poster) {
        return res.status(404).json({ success: false, message: "Poster not found." });
    }
    res.json({ success: true, message: "Poster retrieved successfully.", data: poster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

router.post('/create',uploadPoster.single('image'),async function(req,res){
try{
    const {name}=req.body;
    const image=req.file?`https://admindashboard-backend-gzfl.onrender.com/image/poster/${req.file.filename}`:null;
    if(!name || !image)
    {
        return res.status(400).json({message:"name and image are required"});
    }
    const newPoster= new Poster({name,image});
    await newPoster.save();
    res.json({ success: true, message: "Poster created successfully.", data: null });
}
catch(error){
    console.error("error creating poster");    
    res.status(500).json({error: error.message});
}
});

router.put('/update/:id',uploadPoster.single('image'), async function(req,res)
  {
       const {name}= req.body;
       const image=req.file?`https://admindashboard-backend-gzfl.onrender.com/image/poster/${req.file.filename}`:null;
    try {
        //find category by id
        const poster= await Poster.findById(req.params.id);
        if(!poster)
        {
           return res.status(404).json({message:'poster not found'});
        }

        if(image) poster.image=image;
        if(name) poster.name=name;
         // Save the updated category
         await poster.save();
         res.json({ message: "poster updated successfully", poster });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
)

router.delete('/:id',async function(req,res) {
    const posterID = req.params.id;
    try {
        const deletedPoster = await Poster.findByIdAndDelete(posterID);
        if (!deletedPoster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }
        res.json({ success: true, message: "Poster deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

module.exports = router;
