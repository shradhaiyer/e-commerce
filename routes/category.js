const express = require('express');
const router = express.Router();
const { createCategory, 
        getCategory,
        categoryById, 
        deleteCategory, 
        updateCategory,
        getAllCategories} = require('../controllers/category');
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, createCategory);
router.get("/category/:categoryId" , getCategory);
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, deleteCategory);
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, updateCategory);
router.get("/categories" , getAllCategories);


router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;