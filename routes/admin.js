const app = require('express')()
const { checkToken, checkUserPermission, getUsers, signUp, editUser, deleteUser ,ok} = require('../controllers/authController')
const { addProduct, getAllProducts } = require('../controllers/productsController')

app.route('/users').get(checkToken, checkUserPermission, getUsers)
app.route('/check/permissions').get(checkUserPermission,ok)
app.route('/users/new').post(checkToken, checkUserPermission, signUp)
app.route('/users/edit').put(checkToken, checkUserPermission, editUser)
app.route('/users/delete').post(checkToken, checkUserPermission, deleteUser)

app.route('/products').get(checkToken, checkUserPermission, getAllProducts)
app.route('/products/new').post(checkToken, checkUserPermission, addProduct)

module.exports.adminRouter = app