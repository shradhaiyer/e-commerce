const User = require('../models/user');
const {errorHandler} = require('../handlers/dbErrorHandler');
const jwt = require('jsonwebtoken'); // used to generate signed token 
const expressJWT = require('express-jwt'); 

const userById = (req, res, next, id) =>{
console.log("Request" +req);
 User.findById(id).exec((err, user) => {
    if(err || !user) {
        return res.status(400).json({
            err: "User Not found"
        });
    }
    req.profile = user;
    next();        
 });
};
module.exports = {userById};