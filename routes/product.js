const express = require('express');
const router = express.Router();
const { createProduct, 
        productById , 
        getProduct, 
        removeProduct, 
        updateProduct,
        getAllProducts,
        getRelatedproducts,
        listCategories,
        listBySearch,
        photo} = require('../controllers/product');
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, createProduct);
router.get("/product/:productId", getProduct);
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, removeProduct);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, updateProduct);
router.get("/products", getAllProducts);
router.get("/products/related/:productId" , getRelatedproducts);
router.get("/products/categories" , listCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;