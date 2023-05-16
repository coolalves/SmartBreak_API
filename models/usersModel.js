const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    
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
    token:{
        type: String,
        required: true,
        default: null,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    connected_in: {
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
    accessibility: {
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
    
}, { collection: 'Users' })

module.exports = mongoose.model('User', usersSchema)
