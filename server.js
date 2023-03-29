const express = require("express")
const app = express()
const mongoose = require("mongoose")

PORT=4000
MONGO_URI='mongodb://admin:xpto123@ac-dxda1ok-shard-00-00.lyyrxwv.mongodb.net:27017,ac-dxda1ok-shard-00-01.lyyrxwv.mongodb.net:27017,ac-dxda1ok-shard-00-02.lyyrxwv.mongodb.net:27017/?ssl=true&replicaSet=atlas-lxm967-shard-0&authSource=admin&retryWrites=true&w=majority'


mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to Database')
        app.listen(PORT, () => {
            console.log("Server Started")
        })
    })
    .catch((error) => { console.log(error) })

