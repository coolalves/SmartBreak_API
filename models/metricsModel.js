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
}, { collection: 'Metrics' })

module.exports = mongoose.model('Metric', metricsSchema)