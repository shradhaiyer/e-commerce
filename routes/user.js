const express = require('express');
const router = express.Router();

const {sayHi, signIn, signUp} = require('../controllers/user');
const {userSignupValidator} = require('../validator/index');


router.get('/', sayHi);
router.post('/signup', userSignupValidator, signUp );
router.post('/signin', signIn);

module.exports = router;