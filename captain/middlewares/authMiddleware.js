const jwt = require('jsonwebtoken')
const captainModel = require('../models/captain.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');


module.exports.captainAuth = async (req, res, next) => {
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
        const captain = await captainModel.findById(decoded.id)
        
        if(!captain){
            return res.status(401).json({msg: "Unauthorized"})
        }

        req.captain = captain;
        next();

    } catch (error) {
        res.status(500).json({msgg: error.stack})
    }
}