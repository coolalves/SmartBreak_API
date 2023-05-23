const mongoose = require('mongoose')

const goalsSchema = new mongoose.Schema({
   
    description: {
        type: String,
        required: true
    },
    destination: {
        type: Array,
        required: true
    },
    priority: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    types: {
        type: Array,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    }
}, { collection: 'Goals' })

module.exports = mongoose.model('Goal', goalsSchema)