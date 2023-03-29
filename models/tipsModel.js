const mongoose = require('mongoose')

const tipsSchema = new mongoose.Schema({
   
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Tip', tipsSchema)