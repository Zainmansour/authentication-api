const userDb = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const express = require('express');
const app = express();
app.use(express.json())
require('dotenv').config()

function getToken(req) {
    let token = req.headers.authorization;
    if (!token) return undefined;
    else return token.split(' ')[1]
}

const checkToken =  (req, res, next) => {

    try {
        let token = getToken(req)

        if (token !== undefined) {

            if ( jwt.verify(token, process.env.JWT_SECRET)) {
                next()
            }
            else {
                res.status(301).json({
                    status: 'fail',
                    msg: 'please login again'
                })
            }
        }
        else {
            res.status(302).json({
                status: 'fail',
                msg: 'you aren\'t logged in'
            })
        }
    } catch (error) {
        console.log(error)
    }



}


const login = async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body)
    let userData = await userDb.findOne({ email: email });
    if (!userData) {
        res.status(404).json({
            status: 'fail',
            msg: 'email is not used please sign up first and try to login again'
        })
    }
    else if (userData.password == password) {
        let userToken = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.expiresDate
        })
        res.status(200).json({
            status: 'ok',
            msg:{
                token:userToken
            }
        })
    }
    else {
        res.status(400).json({
            status: 'fail',
            msg: 'incorrect password'
        })
    }
}

const signUp = async (req, res) => {
    const userInfo = req.body;
    console.log(req.body)

    let ok = await userDb.findOne({email:userInfo.email})

    if (ok)
        return res.status(302).json({ status: "fail", msg: "email already used" });
    const newUser = new userDb(userInfo);
    newUser.save().then(ss => {
        return res.status(200).json({ status: "ok", msg: "user created" });
    }).catch((err) => {
        console.log(err);
        return res.status(502).json({ status: "fail", msg: "an error occur please try again later" })
    })

}

const protectSignUp = (req, res, next) => {
    req.body.role = 'user';
    next()
}
const checkUserPermission = async (req, res, next) => {
    const userToken = getToken(req);
    let data = jwt.verify(userToken, process.env.JWT_SECRET)
    let user = await userDb.findById(data.id)
    console.log(user)
    if (user.role !== 'admin') {
        res.status(403).json({
            status: 'fail',
            msg: 'permossion denied'
        })
    }
    else next()

}
const ok=(req,res)=>{
    res.status(200).json({
        status:'ok',
        msg:'everything ok'
    })
}

const getUsers = async (req, res) => {
    console.log('suii')
    let users = await userDb.find({});
    if (users) {
        res.status(200).json({ status: 'ok', msg: users })
    }
    else if (users === []) res.status(404).json({ status: 'fail', msg: 'there is no users in DB' })
    else res.status(502).json({ status: 'fail', msg: 'intral server error' })

}
const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({
        status: 'ok',
        msg: 'logged out',
    })
}

const editUser = async (req, res) => {
    let token = getToken(req)
    let data = jwt.verify(token, process.env.JWT_SECRET)
    if(!data){
        res.status('403').json({
          status:'fail',
          msg:'please login again'  
        })
    }
    let userId = data.id
    let userNewData = req.body
    let user = await userDb.findByIdAndUpdate(userId, userNewData)

    if (user) {
        res.status(200).json({ status: 'ok', msg: 'user Updated' })
    }
    else {
        res.status(502).json({ status: 'fail', msg: 'an error occurs' })
    }

}
const deleteUser = (req, res) => {
    let email = req.body.email
    userDb.deleteOne({ email }).then(ss => {
        res.status(200).json({ status: 'ok', msg: 'user deleted' })
    }).catch(err => {
        console.log(err)
        res.status(502).json({ status: 'fail', msg: 'an error occurs' })
    })
}
const checkLogin = (req, res, next) => {
    let token = getToken(req)
    if (token != undefined) {
        if (jwt.verify(token, process.env.JWT_SECRET)) {
            res.redirect('/auth/edit')
        }
        else next()
    }
    else next()
}
const getUserData = async (req, res) => {
    console.log(getToken(req))
    let id = jwt.verify(getToken(req), process.env.JWT_SECRET).id
    let user = await userDb.findById(id)
    if (user) {
        res.status(200).json({ status: 'ok', msg: user })
    }
    else {
        res.status(502).json({ status: 'fail', msg: 'an error occurs' })
    }
}
module.exports = {
    signUp,
    login,
    checkToken,
    protectSignUp,
    checkUserPermission,
    getToken,
    getUsers,
    logout,
    editUser,
    deleteUser,
    getUserData,
    checkLogin,
    ok
}
