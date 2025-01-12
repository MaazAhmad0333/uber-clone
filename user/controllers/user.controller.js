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
        res.status(200).json({msg: 'New user created successfully', userDetail: newUser})
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

        const token = jwt.sign({id: user.id, }, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.cookie('token', token);
        res.status(200).json({msg: `{user.name} logged in successfully`});
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

// ====================================================================================================


// Logout Functionality

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookie.token;
        await blacklisttokenModel.create({token})
        res.clearCookie('token')
        res.send({msg: 'User Logged out successfully'})
    } catch (error) {
        res.status(500).json({msg: error.message})  
    }
}

// ===================================================================================================


// Current User Profile

module.exports.profile = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

// ======================================================================================================