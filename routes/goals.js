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

//GET A SPECIFIC GOAL (DESTINATION) OR ACTIVE/DONE GOALS
router.get('/:id', async (req, res) => {
    let goals = []
    try {
        // get goals in progress 
        if (req.params.id === "active") { 
            goals = await Goal.find({active: true})
        }
        // get conclued goals
        else if (req.params.id === "done") {
            goals = await Goal.find({active: false})
        } 
        // get goals by destination
        else if (req.params.id.includes("destination=")){ 
            let id = req.params.id.substring(12)
            console.log(id)
            const elements = await Goal.find()
            elements.forEach(element => {
                if (element.destination.includes(id)) {
                    goals.push(element)
                }
            });
        } 
        // get goal by id
        else { 
           goals = await Goal.findById(req.params.id)
            if (goals == null) {
                return res.status(404).json({message: 'Cannot find goal'})
            }        
        }
        res.json(goals)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//EDIT A SPECIFIC GOAL
router.patch('/:id', async (req, res) => {
    let goal
    try {
        goal = await Goal.findById(req.params.id)
        if (goal == null) {
        return res.status(404).json({message: 'Cannot find goal'})
    }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.goal = goal
    if (req.body.description != null) {
        res.goal.description = req.body.description
    } 
    if (req.body.destination != null) {
        res.goal.destination = req.body.destination
    } 
    if (req.body.priority != null) {
        res.goal.priority = req.body.priority
    } 
    if (req.body.date != null) {
        res.goal.date = req.body.date
    } 
    if (req.body.active != null) {
        res.goal.active = req.body.active
    } 
    if (req.body.types != null) {
        res.goal.types = req.body.types
    } 
    try {
        const updatedGoal = await res.goal.save()
        res.json(updatedGoal)
    } catch (err) {
        res.status(400).json({message : err.message})
    }
})

//DELETE A SPECIFIC GOAL
router.delete('/:id', async (req, res) => {
    try {
        const goal = await Goal.findByIdAndRemove(req.params.id)
        if (goal == null) {
            return res.status(404).json({message: 'Cannot find goal'})
        }
        res.json({message : 'Goal Deleted'})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    
})

module.exports = router