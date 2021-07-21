const Product = require('../models/product');
const {errorHandler} = require('../handlers/dbErrorHandler');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { response } = require('express');

const productById = (req, res, next, id) => {
    Product.findById(id)
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }
            req.product = product;
            next();
        });
}

const createProduct = (req, res) => {
    // need to handle form data
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json ({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        console.log(files , " FILES")
        const {name, description, price, quantity, shipping, category } = fields  ;

        if( !name || !description || !price || !quantity || !shipping || !category)
        {
            return res.status(400).json({
                err: "All fields need to be filled"
            });
        }
    let product = new Product(fields);
    if(files.photo) {
        if(files.photo.size > 1000000)
        {
            return res.status(400).json({
                err: "Image should be less than 1mb"
            });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
        if(err)
        {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        res.json(result);

    })

    });
}


const getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}


const removeProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err)
        {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        res.json({
            deletedProduct,
            success : "Product removed from the database"
        });
    });
}


const updateProduct = (req, res) => {
    // need to handle form data
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json ({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        console.log(fields , " FILES")

        const {name, description, price, quantity, shipping, category } = fields;

        if( !name || !description || !price || !quantity || !shipping || !category)
        {
            return res.status(400).json({
                err: "All fields need to be filled"
            });
        }
    let product = req.product;
    product = _.extend(product, fields);
    if(files.photo) {
        if(files.photo.size > 1000000)
        {
            return res.status(400).json({
                err: "Image should be less than 1mb"
            });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
        if(err)
        {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        res.json(result);

    })

    });
}

// by sell = /products?sortBy=sold&order=desc&limit=4

// by Arrival = /products?sortBy=createdAt&order=desc&limit=4
const getAllProducts = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    let sortBy = req.query.sortBy ?  req.query.sortBy : '_id';


                //deselecting photos
    Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data) => {
        if(err)
        {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        res.send(data);
});

}

//it will find products based on request product category
const getRelatedproducts = (req, res) => {
    let product = req.product;
    let category = product.category;
    Product.find({ category })
           .select("-photo")
           .exec((err, products) => {
        if(err)
        {
            return res.status(400).json({
                err : errorHandler(err)
            });
        }
        let productList = [];

        products.forEach(product => {
            productList.push(product)
        });

        return res.json(productList);

    })
}


const listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if(err)
        {
            return res.status(400).json({
                err : "Categories not found."
            });
        }
        res.json(categories);
    })
}

const listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
}

const photo = (req, res, next) => {
if(req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
}
next();
}
module.exports = {createProduct , productById, getProduct, removeProduct, updateProduct, getAllProducts, getRelatedproducts, listCategories, listBySearch, photo};