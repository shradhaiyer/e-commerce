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


const getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

const updateUser = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id}, 
        {$set: req.body}, 
        {new:true}, 
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    err: "Update failed"
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.json(user);
        })
}
module.exports = {userById, getUser, updateUser};