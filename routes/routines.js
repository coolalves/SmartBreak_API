const express = require("express");
const router = express.Router();
const Routine = require("../models/routinesModel");
const checkToken = require("../security/checkToken");

//GET ALL DEVICES
router.get("/", checkToken, async (req, res) => {
  try {
    const routines = await Routine.find();
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A ROUTINE
router.post("/", checkToken, async (req, res) => {
  const routine = new Routine({
    end: req.body.end,
    start: req.body.start,
    state: req.body.state,
    days: req.body.days,
    user: req.body.user,
  });
  try {
    const newDevice = await routine.save();
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC ROUTINE
router.get("/:id", checkToken, async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (routine == null) {
      return res.status(404).json({ message: "Cannot find routine" });
    }
    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC ROUTINE
router.patch("/:id", checkToken, async (req, res) => {
  let routine;
  try {
    routine = await Routine.findById(req.params.id);
    if (routine == null) {
      return res.status(404).json({ message: "Cannot find routine" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.routine = routine;
  if (req.body.end != null) {
    res.routine.end = req.body.end;
  }
  if (req.body.start != null) {
    res.routine.start = req.body.start;
  }
  if (req.body.state != null) {
    res.routine.state = req.body.state;
  }
  if (req.body.days != null) {
    res.routine.days = req.body.days;
  }
  try {
    const updateDevice = await res.routine.save();
    res.json(updateDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET USER DEVICES
router.get("/user/:id", checkToken, async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.params.id });
    if (routines == null) {
      return res.status(404).json({ message: "Cannot find routines" });
    }
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC ROUTINE
router.delete("/:id", checkToken, async (req, res) => {
  try {
    await Routine.findByIdAndRemove(req.params.id);
    res.json({ message: "Routine Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
