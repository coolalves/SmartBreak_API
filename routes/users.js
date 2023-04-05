const express = require('express')
const router = express.Router()
const User = require('../models/usersModel')

//GET ALL USERS
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//GET ONE USER
router.get('/:id', getUser, async (req, res) => {
    res.send(res.user)
})

//ADD ONE USER
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin,
        battery: req.body.battery,
        department: req.body.department
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message : err.message})
    }
})

//UPDATE ONE USER
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.surname != null) {
        res.user.surname = req.body.surname
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    if (req.body.password != null) {
        res.user.password = req.body.password
    }
    if (req.body.admin != null) {
        res.user.admin = req.body.admin
    }
    if (req.body.battery != null) {
        res.user.battery = req.body.battery
    }
    if (req.body.department != null) {
        res.user.department = req.body.department
    }
    if (req.body.total_battery != null) {
        res.user.total_battery = req.body.total_battery
    }
    if (req.body.pauses != null) {
        res.user.pauses = req.body.pauses
    }
    if (req.body.routines != null) {
        res.user.routines = req.body.routines
    }
    if (req.body.devices != null) {
        res.user.devices = req.body.devices
    }
    if (req.body.rewards != null) {
        res.user.rewards = req.body.rewards
    }
    if (req.body.acessibility != null) {
        res.user.acessibility = req.body.acessibility
    }
    if (req.body.notifications != null) {
        res.user.notifications = req.body.notifications
    }
    if (req.body.permissions != null) {
        res.user.permissions = req.body.permissions
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//DELETE ONE USER
router.delete('/:id', (req, res) => {

})

//GET A USER'S HISTORY
router.get('/:id/history', (req, res) => {

})

//GET A USER'S DEVICES
router.get('/:id/devices', (req, res) => {

})

//ADD A NEW USER'S DEVICE
router.post('/:id/devices', (req, res) => {

})

//EDIT A USER'S DEVICE
router.patch('/:id/devices/:device_id', (req, res) => {

})

//DELETE A USER'S DEVICE
router.delete('/:id/devices/:device_id', (req, res) => {

})

//GET A USER'S ROUTINES
router.get('/:id/routines', (req, res) => {

})

//ADD A NEW USER'S ROUTINE
router.post('/:id/routines', (req, res) => {

})

//EDIT A USER'S ROUTINE
router.patch('/:id/routines/:routine_id', (req, res) => {

})

//DELETE A USER'S ROUTINE
router.delete('/:id/routines/:routine_id', (req, res) => {

})

//GET A USER'S REWARDS
router.get('/:id/rewards', (req, res) => {

})

//GET USERS FROM A DEPARTMENT
router.get('/:department_id/', (req, res) => {

})

//GET USERS FROM A ORGANIZATION
router.get('/:organization_id/', (req, res) => {

})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({message: 'Cannot find user'})
        }

    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.user = user
    next()
}

module.exports = router