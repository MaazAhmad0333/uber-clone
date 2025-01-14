const captainModel = require('../models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklisttokenModel = require('../models/blacklisttoken.model');

// Registration functionality

module.exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const captain = await captainModel.findOne({email});

        if(captain){
            return res.status(400).json({msg: 'Captain already exists'})
        }


        const hash = await bcrypt.hash(password, 10);
        const newCaptain = new captainModel({name, email, password: hash});
        await newCaptain.save();

        const token = jwt.sign({id: newCaptain.id, }, process.env.JWT_SECRET, {expiresIn: '1h'})

        res.cookie('token', token);
        // delete captain._doc.password;
        res.status(200).json({token: token , captainDetail: newCaptain})
    } catch (error) {
        console.log("🚀 ~ module.exports.register= ~ error:", error)
        res.status(500).json({msg: error.message})      
    }
}

// ====================================================================================================


// Login Functionality

module.exports.login = async (req, res) => { 
    try {
        const {email, password} = req.body;
        const captain = await captainModel.findOne({email}).select('+password')
    
        if(!captain){
            return res.status(400).json({msg: 'Invalid email or password'})
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if(!isMatch){
            return res.status(400).json({msg: 'Invalid email or password'})
        }

        const token = jwt.sign({id: captain.id }, process.env.JWT_SECRET, {expiresIn: "1h"});

        delete captain._doc.password; // Password will be removed form the response so that user will not be able to se the password

        res.cookie('token', token);
        res.status(200).json({token: token, user: captain});
        
    } catch (error) {
        res.status(500).json({msg: error.stack}) // This "error.stack" will give the full detail about the error.
    }
}

// ====================================================================================================


// Logout Functionality

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
        if(!token){
            return res.status(400).json({ msg: "Token not provided" });
        }
        await blacklisttokenModel.create({token})
        res.clearCookie('token')
        res.send({msg: 'Captain Logged out successfully'})
    } catch (error) {
        return res.status(500).json({msg: error.stack})  
    }
}

// ===================================================================================================


// Current User Profile

module.exports.profile = async (req, res) => {
    try {
        res.json(req.captain)
    } catch (error) {
        res.status(500).json({msg: error.stack})
    }
}

// ======================================================================================================


// Toggle Availibility

module.exports.toggleAvailability = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id)
        captain.isAvailable = !captain.isAvailable;
        await captain.save()
        res.status(200).json(captain)
    } catch (error) {
        return res.status(500).json({msg: error.stack})
    }
}

// =====================================================================================================