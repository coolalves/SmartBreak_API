const express = require("express");
const router = express.Router();
const Tip = require("../models/tipsModel");
const verifyToken = require("../security/verifyToken");

//GET ALL TIPS
router.get("/", verifyToken, async (req, res) => {
  try {
    const tips = await Tip.find();
    res.status(200).json({message : tips});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A TIP
router.post("/", verifyToken, async (req, res) => {
  const tip = new Tip({
    type: req.body.type,
    description: req.body.description,
  });
  try {
    const newTip = await tip.save();
    res.status(201).json(newTip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET TIPS BY TYPE
router.get("/:type", verifyToken, async (req, res) => {
  try {
    const tips = await Tip.find({ type: req.params.type });
    res.status(200).json({message: tips});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
