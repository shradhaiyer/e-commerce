const express = require('express');
const router = express.Router();

const {sayHi, signIn, signUp, signOut, requireSignin} = require('../controllers/auth');
const {userSignupValidator} = require('../validator/index');


router.get('/', sayHi);
router.post('/signup', userSignupValidator, signUp );
router.post('/signin', signIn);
router.get('/signout', signOut);
module.exports = router;