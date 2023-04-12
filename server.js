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

const usersRouter = require('./routes/users.js')
const tipsRouter = require('./routes/Tips')
const goalsRouter = require('./routes/Goals')
const departmentsRouter = require('./routes/Departments')
const metricsRouter = require('./routes/Metrics')
const rewardsRouter = require('./routes/Rewards')
const organizationsRouter = require('./routes/Organizations')
const pausesRouter = require('./routes/Pauses')
const devicesRouter = require('./routes/Devices')
const routinesRouter = require('./routes/Routines')

app.use('/users', usersRouter)
app.use('/tips', tipsRouter)
app.use('/goals', goalsRouter)
app.use('/departments', departmentsRouter)
app.use('/metrics', metricsRouter)
app.use('/rewards', rewardsRouter)
app.use('/organizations', organizationsRouter)
app.use('/pauses', pausesRouter)
app.use('/devices', devicesRouter)
app.use('/routines', routinesRouter)
