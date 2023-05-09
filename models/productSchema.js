const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Product = new Schema(
    {
        id: {
            type: Number,
        },
        name: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model("products", Product)