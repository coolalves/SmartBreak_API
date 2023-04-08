const mongoose = require('mongoose')

const metricsSchema = new mongoose.Schema({
   
    description: {
        type: String,
        required: true
    }, 
    type : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Metric', metricsSchema)