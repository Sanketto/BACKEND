const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    title: {
        type: String,
        required: true
    },
    
    price: {
            type: Number,
            required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    }

    }
)

module.exports = mongoose.model('Products', Product)