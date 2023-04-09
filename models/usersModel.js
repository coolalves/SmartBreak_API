const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    // id: {
    //     type: Number,
    //     required: true,
    // },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    battery: {
        type: Number,
        required: true,
        default: 0,
    },
    total_battery: {
        type: Number,
        required: true,
        default: 0,
    },
    pause: {
        type: Boolean,
        required: true,
        default: false
    },
    department: {
        type: String,
        required: true,
    },
   
    rewards: {
        type: Array,
        required: true,
        default: [],
    },
    acessibility: {
        type: Array,
        required: true,
        default: [false, false],
    },
    permissions: {
        type: Array,
        required: true,
        default: [false, true],
    },
    notifications: {
        type: Array,
        required: true,
        default: [false, true, true, true],
    },
    
})

module.exports = mongoose.model('User', usersSchema)