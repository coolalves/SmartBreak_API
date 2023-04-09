const mongoose = require('mongoose')

const rewardsSchema = new mongoose.Schema({
   
    description: {
        type: String,
        required: true
    }, 
    type : {
        type: String,
        required: true
    }
}, { collection: 'Rewards' })

module.exports = mongoose.model('Reward', rewardsSchema)