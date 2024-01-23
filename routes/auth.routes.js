var express = require('express');
var router = express.Router();

//Middleware
const isAuthenticated = require("../middleware/isAuthenticated.js");

//User Schema
const Users = require('../models/Users.model.js');

//Bcrypt for password encrypting.
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//JWT for creating tokens for users
const jwt = require("jsonwebtoken");


//Signup
router.post('/signup', async (req,res) => {
    const {name, lastName, email, password, telephone, address, nationalID } = req.body

    //Checking if all fields are not empty.
    //NOTE: Might change this into a switch statement later for a more accurate error message.
    if(name === '' || lastName === '' || email === '' || password === ""){
        return res.status(400).json({success: false, message: "All fields must be filled."})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success:false, message: "Provide a valid email address." });
    }
   /* 
   Password With Regex
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
    res.status(400).json({ success:false, message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  */
    try {

        const userExists = await Users.findOne({email})
        if(userExists){
            return res.status(400).json({success:false, message: "A user with that email already exists."})
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new Users({name, lastName, email, password: hashedPassword, telephone, address, nationalID})
        await newUser.save()
        const {_id} = newUser
        const payload  = {_id, name, lastName, email, telephone, address, nationalID}

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });

        // Send the token and new user as the response
        return res.status(200).json({ success:true, authToken });
        // return res.status(200).json({ success:true });

    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
})

//Login

router.post('/login', async (req, res) => {
    
    const {email, password} = req.body;
    if(email === '' || password === ''){
        res.status(400).json({ message: "Provide email and password." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success:false, message: "Provide a valid email address." });
    }
    try {
        const userExists = await Users.findOne({email})
        if(!userExists){
            return res.status(401).json({ success:false, message: "No User with that email was found." });
        }
        const correctPassword = bcrypt.compareSync(password, userExists.password) 
        if(!correctPassword){
            return res.status(401).json({success:false, message: "Incorrect Password!"})
        }
        const {_id, name, lastname, telephone, address, nationalID} = userExists
        const payload  = {_id, name, lastname, email, password, telephone, address, nationalID}

         // Create and sign the token
         const authToken = jwt.sign(payload, process.env.SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });
        return res.status(200).json({ success:true, authToken });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ success:false, message: error.message });
    }

})


router.get("/verify", isAuthenticated, async (req, res) => {
    res.status(200).json({ user: req.user, success: true });
  });

module.exports = router;