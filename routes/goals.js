const express = require('express')
const router = express.Router()
const Goal = require('../models/goalsModel')

//GET ALL GOALS
router.get('/', async (req, res) => {
    try {
        const goals = await Goal.find()
        res.json(goals)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//ADD A GOAL
router.post('/', async (req, res) => {
    const goal = new Goal({
        description: req.body.description,
        destination: req.body.destination,
        priority: req.body.priority,
        date: req.body.date,
        types: req.body.types,
        active: req.body.active
    })
    try {
        const newGoal = await goal.save()
        res.status(201).json(newGoal)
    } catch (err) {
        res.status(400).json({message : err.message})
    }
})

//GET A SPECIFIC GOAL (DESTINATION)
router.get('/:id', async (req, res) => {
    let response = []
    try {
        const goals = await Goal.find()
        goals.forEach(element => {
            if (element.destination.includes(req.params.id)) {
                response.push(element)
            }
        });
        res.json(response)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//GET ACTIVE GOALS
router.get('/active', async (req, res) => {
    try {
        const goals = await Goal.find({active: true})
        res.json(goals)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


//GET DONE GOALS
router.get('/done', async (req, res) => {
    try {
        const goals = await Goal.find({"active": false})
        res.json(goals)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router