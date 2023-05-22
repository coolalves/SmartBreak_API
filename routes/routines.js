const express = require("express");
const router = express.Router();
const Routine = require("../models/routinesModel");
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL ROUTINES
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });

    const routines = await Routine.find();
    res.status(200).json({ message: routines });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A ROUTINE
router.post("/", verifyToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = await User.findOne({ token: token })
  const user_id = user.id

  const routine = new Routine({
    end: req.body.end,
    start: req.body.start,
    days: req.body.days,
    user: user_id,
  });
  try {
    const newRoutine = await routine.save();
    res.status(201).json({ message: newRoutine, id: newRoutine._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC ROUTINE
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const routine = await Routine.findById(req.params.id);

    if (!routine)
      return res.status(404).json({ message: "Cannot find routine" });

    if (user.id != routine.user)
      return res.status(403).json({ message: "Cannot access the content" });

    res.status(200).json({ message: routine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC ROUTINE
router.patch("/:id", verifyToken, async (req, res) => {

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const routine = await Routine.findById(req.params.id);

    if (!routine)
      return res.status(404).json({ message: "Cannot find routine" });

    if (user.id != routine.user)
      return res.status(403).json({ message: "Cannot access the content" });

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
    const updateRoutine = await res.routine.save();
    res.status(200).json({ message: updateRoutine });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USER ROUTINES
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })

    if (user.id != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    const routines = await Routine.find({ user: req.params.id });

    if (!routines)
      return res.status(404).json({ message: "Cannot find routines" });

    res.status(200).json({ message: routines });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC ROUTINE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const routine = await Routine.findById(req.params.id);

    if (!routine)
      return res.status(404).json({ message: "Cannot find routine" });

    if (user.id != routine.user)
      return res.status(403).json({ message: "Cannot access the content" });

    await Routine.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Routine Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
