const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const { adminRouter } = require('./routes/admin')
const { authRouter } = require('./routes/auth')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI).then(() => console.log('connected to db')).catch(err => console.log(err))

app.use(cors())
app.use(express.json())

app.use('/admin', adminRouter)
app.use('/auth', authRouter)

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`listening to port ${port}`)
})