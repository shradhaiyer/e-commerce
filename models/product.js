const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true,
            maxlength: 32
        },
        quantity: {
            type: Number,
            trim: true,
            required: true,
        },
        sold : {
            type: Number, 
            defualt: 0
        },
        photo:{
            data: Buffer,
            contentType: String
        },
        shipping: {
            required: false,
            type: Boolean
        }

    },
    { timestamps: true }
);


module.exports = mongoose.model('Product', productSchema);
