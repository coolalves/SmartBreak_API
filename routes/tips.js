const express = require("express");
const router = express.Router();
const Tip = require("../models/tipsModel");
const User = require("../models/usersModel");
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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = await User.findOne({ token: token })
  if (!user.access)
    return res.status(403).json({ message: "Cannot access the content" });

  const tip = new Tip({
    type: req.body.type,
    description: req.body.description,
  });
  try {
    const newTip = await tip.save();
    res.status(201).json({message: newTip, id: newTip._id});
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
