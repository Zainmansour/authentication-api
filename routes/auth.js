const app = require('express')()
const { login, signUp, protectSignUp, checkToken, logout, editUser, getUserData, checkLogin } = require('../controllers/authController')

app.route('/login').post(login)
app.route('/signup').post(checkLogin, protectSignUp, signUp)
app.route('/logout').delete(logout)
app.route('/edit').put(checkToken, editUser).get(checkToken, getUserData)
app.route('/createadminuser').post(signUp)


module.exports.authRouter = app