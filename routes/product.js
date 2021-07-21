const express = require('express');
const router = express.Router();
const {createProduct, productById , getProduct, removeProduct, updateProduct} = require('../controllers/product');
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, createProduct);
router.get("/product/:productId", getProduct);
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, removeProduct);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, updateProduct);


router.param('userId', userById);
router.param('productId', productById);

module.exports = router;