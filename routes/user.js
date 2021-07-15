const express = require('express');
const router = express.Router();

const {sayHi} = require('../controllers/user');
const {signUp} = require('../controllers/user');
const {userSignUpValidator} = require('../validator/index');


router.get('/', sayHi);
router.post('/signup', userSignUpValidator, signUp );

module.exports = router;