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

//GET A SPECIFIC TIP
router.get('/:type', async (req, res) => {
    let response = []
    try {
        const tips = await Tip.find()
        tips.forEach(element => {
            if (element.type == req.params.type) {
                response.push(element)
            }
        });
        res.json(response)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router