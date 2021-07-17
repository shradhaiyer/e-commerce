const User = require('../models/user');
const {errorHandler} = require('../handlers/dbErrorHandler');
const jwt = require('jsonwebtoken'); // used to generate signed token 
const expressJWT = require('express-jwt'); // used for authorization check 
const sayHi = (req, res) =>{
    res.json ({message: "hello there"});
};

const signUp = (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save((err, user) => { 
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)            
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined; 
        res.json({
            user
        });
    });
};

const signIn = (req, res) => {
    console.log(req.body);
    // find user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                err: 'User with that email does not exist'
            });
        }
       // create authenticate method in user model to compare passwords
        if(!user.authenticate(password))
            return res.status(401).json({
                err: "Email and password don't match"
            });
       // generate a signed token with user id and secret
       const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
       // persist the token as t in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       // return response with user and token to frotend client
       const {_id, name, email, role} = user;
       return res.json({ token, user : {_id, name, email, role}});

    });
    
}

const signOut = (req, res) => {
    res.clearCookie("t");
    res.json({message: "Sign out Successful"});
}

// lets user access only if sign In token found
const requireSignin = expressJWT({
    secret: process.env.JWT_SECRET ,
    algorithms: ["HS256"], 
    // adding a property 
    userProperty: "auth",
  });


const isAuth = (req, res, next) => {
 let user = req.profile && req.auth && req.profile._id == req.auth._id;
 if(!user) {
     res.status(403).json({
         err :"Access denied"
     });
 }
 next();
};

const isAdmin = (req, res, next) => {
   if(req.profile.role === 0) {
       return res.status(403).json({
           err: "Access restricted to admins."
       });
    }
    next();
};


module.exports = {sayHi, signUp, signIn, signOut, requireSignin, isAuth, isAdmin};