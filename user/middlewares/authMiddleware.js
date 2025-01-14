const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');


module.exports.userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
        // console.log("🚀 ~ module.exports.userAuth= ~ token:", token)

        if(!token){
            return res.status(401).json({msg: "Token Required"})
        }

        const isBlacklisted = await blacklisttokenModel.find({token});
        if(isBlacklisted.length){
            return res.status(401).json({msgg: 'Unauthorized'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("🚀 ~ module.exports.userAuth= ~ decoded:", decoded)
        const user = await userModel.findById(decoded.id)
        
        if(!user){
            return res.status(401).json({msg: "Unauthorized"})
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({msgg: error.stack})
    }
}