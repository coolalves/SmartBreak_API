const express = require('express')
const router = express.Router()
const Tip = require('../models/tipsModel')

//GET ALL TIPS
router.get('/', async (req, res) => {
    try {
        const tips = await Tip.find()
        res.json(tips)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//ADD A TIP
router.post('/', async (req, res) => {
    const tip = new Tip({
        type: req.body.type,
        description: req.body.description
    })
    try {
        const newTip = await tip.save()
        res.status(201).json(newTip)
    } catch (err) {
        res.status(400).json({message : err.message})
    }
})

//GET TIPS BY TYPE
router.get('/:type', async (req, res) => {
    try {
        const tips = await Tip.find({type: req.params.type})
        res.json(tips)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


module.exports = router