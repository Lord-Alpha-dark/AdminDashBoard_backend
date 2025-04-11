const express = require('express');
const router = express.Router();
const Admin = require('../Models/AdminSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//signup route
router.post('/signup', async function (req, res) {
  const { name, email, password } = req.body;
  try {


    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name, email, and password are required" });

    }
    let admin = await Admin.findOne({ email: email });
    if (admin) {
      return res.status(400).json({ success: false, message: "admin already exists" });
    }


    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(200).json({ success: true, message: "admin created successfully", data: newAdmin });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

//login route
router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password are required" });
    }

    //find admin by email
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "admin not found" });
    }

    //check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "password is incorrect" });
    }

    //generate token
    const jwtToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).json({ success: true, message: "admin logged in successfully", token: jwtToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/tokenIsValid", async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(false);
    }
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(verified.id);
    if (!admin) {
      return res.json(false);
    }
    return res.json(true);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user data excluding password
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, message: "Admin profile", data: admin });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
})
module.exports = router;