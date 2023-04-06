require('dotenv').config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => {
        console.log('Connected to Database')
        app.listen(process.env.PORT, () => {
            console.log("Server Started")
        })
    })
    .catch((error) => { console.log(error) })

app.use(express.json())

const usersRouter = require('./routes/users')
const tipsRouter = require('./routes/tips')
const goalsRouter = require('./routes/goals')
const departmentsRouter = require('./routes/departments')

app.use('/users', usersRouter)
app.use('/tips', tipsRouter)
app.use('/goals', goalsRouter)
app.use('/goals/active', goalsRouter)
app.use('/departments', departmentsRouter)