const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')


module.exports.userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

        if(!token){
            return res.status(401).json({msg: "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWR_SECRET);
        const user = await userModel.findById(decoded.id)
        
        if(!user){
            return res.status(401).json({msg: "Unauthorized"})
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}