const express = require('express');
const router = express.Router();

const {sayHi} = require('../controllers/user');
const {signUp} = require('../controllers/user');


router.get('/', sayHi);
router.post('/signup', signUp )

module.exports = router;