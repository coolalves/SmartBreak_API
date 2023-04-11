const express = require('express')
const router = express.Router()
const Metric = require('../models/metricsModel')

//GET ALL METRICS
router.get('/', async (req, res) => {
    try {
        const metrics = await Metric.find()
        res.json(metrics)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//ADD A METRIC
router.post('/', async (req, res) => {
    const metric = new Metric({
        description: req.body.description,
        type: req.body.type
    })
    try {
        const newMetric = await metric.save()
        res.status(201).json(newMetric)
    } catch (err) {
        res.status(400).json({message : err.message})
    }
})

//GET A SPECIFIC METRIC 
router.get('/:id', async (req, res) => {
    try {
        const metrics = await Metric.findById(req.params.id)
        if (metrics == null) {
            return res.status(404).json({message: 'Cannot find metric'})
        }        
        res.json(metrics)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//DELETE A SPECIFIC METRIC
router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        await Metric.findByIdAndRemove(req.params.id)
        res.json({message : 'Metric Deleted'})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    
})

module.exports = router