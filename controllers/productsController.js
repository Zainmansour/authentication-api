const productDb = require('../models/productSchema')
const productCounter = 1

const getProductInfo = async (req, res) => {
    const productId = req.id
    let product = await productDb.findOne({ id: productId })
    if (product)
        res.status(200).json({
            'status': 'ok',
            'msg': product
        })
    else res.status(500).json({
        'status': 'fail',
        'msg': 'an error occurs'
    })
}

const getProductsByCategory = async (req, res) => {
    const category = req.category
    let categories = await productDb.find({ category: category })
    if (categories)
        res.status(200).json({
            'status': 'ok',
            'msg': categories
        })
    else if (categories === []) {
        res.status(400).json({
            'status': 'fail',
            'msg': 'there are no products in this category'
        })
    }
    else res.status(500).json({
        'status': 'fail',
        'msg': 'an error occurs'
    })
}

const addProduct = (req, res) => {
    const productInfo = req.body
    let product = new productDb(productInfo)
    product.save().then(ss => {
        res.status(200).json({
            'status': 'ok',
            'msg': 'success'
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            'status': 'fail',
            'msg': 'an error occurs'
        })
    })
}

const getAllProducts = async (req, res) => {
    const products = await productDb.find({})
    if (products) {
        res.status(200).json({
            'status': 'ok',
            'msg': products
        })
    }
    else if (products === []) {
        res.status(400).json({
            'status': 'fail',
            'msg': 'there are no products in the DB'
        })
    }
    else {
        res.status(500).json({
            'status': 'fail',
            'msg': 'an error occurs'
        })
    }
}

module.exports = {
    getProductInfo,
    getAllProducts,
    getProductsByCategory,
    addProduct
}
