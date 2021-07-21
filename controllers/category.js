const Category = require('../models/category');
const {errorHandler} = require('../handlers/dbErrorHandler');
const jwt = require('jsonwebtoken'); // used to generate signed token 
const expressJWT = require('express-jwt'); 

const categoryById = (req, res, next, id) =>{
     Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                err: "Category Not found"
            });
        }
        req.category = category;
        next();        
     });
}

const getCategory = (req, res) => {
    return res.json(req.category);
}
const deleteCategory = (req, res) => {
    let category = req.category;
    category.remove((err, deletedCategory) => {
        if(err) {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        return res.json({
            deletedCategory,
            message : "Category deleted Successfully"
        });
    })
}

const createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        res.json({data});
    })
}

const updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        res.json({data});
    })
}

const getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err) {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        let categoryList = [];

        categories.forEach(category => {
            categoryList.push(category);
        });
    
        res.send(categoryList);
    })
}
module.exports = {createCategory, getCategory, categoryById, deleteCategory, updateCategory, getAllCategories};