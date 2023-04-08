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

// GET ACTIVE GOALS
router.get('/active', async (req, res) => {
    try {
        const goals = await Goal.find({ active: true })
        res.json(goals)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// GET INACTIVE GOALS
router.get('/inactive', async (req, res) => {
    try {
        const goals = await Goal.find({ active: false })
        res.json(goals)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// GET USER_ID/DEPARTMENT_ID GOALS
router.get('/destination/:id', async (req, res) => {
    try {
        let goals =[]
        const elements = await Goal.find()
        elements.forEach(element => {
            if (element.destination.includes(req.params.id)) {
                goals.push(element)
            }
        });
        res.json(goals)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// GET GOALS SORT BY FILTER
router.get('/destination/:id/filter/:filter', async(req, res) => {
    let filter = req.params.filter
    let destination_id = req.params.id
    let goals = []

    try {
        const elements = await Goal.find()
        elements.forEach(element => {
            if (element.destination.includes(destination_id)) {
                goals.push(element)
            }
        });
    } catch(err) {
        res.status(500).json({message: err.message})
    }

    if (filter == 0) {
        goals.sort((a, b) => a.date - b.date);
    } else if (filter == 1) {        
        goals.sort((a, b) => b.date -a.date);
    } else if (filter == 2) {
        goals.sort((a, b) => a.priority - b.priority);
    } else if (filter == 3) {
        goals.sort((a, b) => b.priority - a.priority);
    } else {
        return res.status(404).json({message: 'Cannot find filter'})
    }
    res.json(goals)
})



//GET A SPECIFIC GOAL 
router.get('/:id', async (req, res) => {
    try {
        const goals = await Goal.findById(req.params.id)
        if (goals == null) {
            return res.status(404).json({message: 'Cannot find goal'})
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
        console.log(req.params.id)
        await Goal.findByIdAndRemove(req.params.id)
        res.json({message : 'Goal Deleted'})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    
})

module.exports = router