const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklisttokenModel = require('../models/blacklisttoken.model');

// Registration functionality

module.exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const user = await userModel.findOne({email});

        if(user){
            return res.status(400).json({msg: 'User already exists'})
        }


        const hash = await bcrypt.hash(password, 10);
        const newUser = new userModel({name, email, password: hash});
        await newUser.save();

        const token = jwt.sign({id: newUser.id, }, process.env.JWT_SECRET, {expiresIn: '1h'})

        res.cookie('token', token);
        delete user._doc.password;
        res.status(200).json({token: token , userDetail: newUser})
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
        const user = await userModel.findOne({email}).select('+password')
    
        if(!user){
            return res.status(400).json({msg: 'Invalid email or password'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({msg: 'Invalid email or password'})
        }

        const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: "1h"});

        delete user._doc.password; // Password will be removed form the response so that user will not be able to se the password

        res.cookie('token', token);
        res.status(200).json({token: token, user: user});
        
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
        res.send({msg: 'User Logged out successfully'})
    } catch (error) {
        return res.status(500).json({msg: error.stack})  
    }
}

// ===================================================================================================


// Current User Profile

module.exports.profile = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        res.status(500).json({msg: error.stack})
    }
}

// ======================================================================================================