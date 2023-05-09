const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        cart: {
            type: [Number],
        },
        role: {
            type: String,
            default: 'user'
        }
    }
)

module.exports = mongoose.model("users", User)