const express = require("express");
const router = express.Router();
const Pause = require("../models/pausesModel");

//GET ALL PAUSES
router.get("/", async (req, res) => {
    try {
        const pauses = await Pause.find();
        res.json(pauses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//ADD A PAUSE
router.post("/", async (req, res) => {
    const pause = new Pause({
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        user: req.body.user,
    });
    try {
        const newPause = await pause.save();
        res.status(201).json(newPause);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//GET A SPECIFIC PAUSE
router.get("/:id", async (req, res) => {
    try {
        const pause = await Pause.findById(req.params.id)
        if (pause == null) {
            return res.status(404).json({ message: 'Cannot find pause' })
        }
        res.json(pause)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//EDIT A SPECIFIC PAUSE
router.patch("/:id", async (req, res) => {
    let pause
    try {
        pause = await Pause.findById(req.params.id)
        if (pause == null) {
            return res.status(404).json({ message: 'Cannot find pause' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.pause = pause
    if (req.body.start_date != null) {
        res.pause.start_date = req.body.start_date
    }
    if (req.body.end_date != null) {
        res.pause.end_date = req.body.end_date
    }
    if (req.body.user != null) {
        res.pause.user = req.body.user
    }
    try {
        const updatedPause = await res.pause.save()
        res.json(updatedPause)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//GET USER PAUSES
router.get("/user/:id", async (req, res) => {
    try {
        const pauses = await Pause.find({user: req.params.id})
        if (pauses == null) {
            return res.status(404).json({ message: 'Cannot find pauses' })
        }
        res.json(pauses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//GET PAUSES BY DATA
router.get("/user/:id/date/:date", async (req, res) => {
    try {
        let pauses = []
        const elements = await Pause.find({user: req.params.id})
        if (elements == null) {
            return res.status(404).json({ message: 'Cannot find pauses' })
        }
        elements.forEach(element => {
            if ((element.start_date).toISOString().includes(req.params.date)) {
                pauses.push(element)
            }
        });
        res.json(pauses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//DELETE A SPECIFIC PAUSE
router.delete("/:id", async (req, res) => {
    try {
        await Pause.findByIdAndRemove(req.params.id)
        res.json({ message: 'Pause Deleted' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
});

module.exports = router;
