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


module.exports = {createProduct , productById, getProduct, removeProduct, updateProduct};