const express = require("express");
const router = express.Router();
const Reward = require("../models/rewardsModel");
const verifyToken = require("../security/verifyToken");

//GET ALL REWARDS
router.get("/", verifyToken, async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A REWARD
router.post("/", verifyToken, async (req, res) => {
  const reward = new Reward({
    description: req.body.description,
    type: req.body.type,
  });
  try {
    const newReward = await reward.save();
    res.status(201).json(newReward);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC REWARD
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const rewards = await Reward.findById(req.params.id);
    if (rewards == null) {
      return res.status(404).json({ message: "Cannot find reward" });
    }
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET REWARDS BY TYPE
router.get("/type/:type", verifyToken, async (req, res) => {
  try {
    const rewards = await Reward.find({ type: req.params.type });
    if (rewards == null) {
      return res.status(404).json({ message: "Cannot find rewards" });
    }
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A REWARD BY ID
router.patch("/:id", verifyToken, async (req, res) => {
  let reward;
  try {
    reward = await Reward.findById(req.params.id);
    if (reward == null) {
      return res.status(404).json({ message: "Cannot find reward" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.reward = reward;
  if (req.body.description != null) {
    res.reward.description = req.body.description;
  }
  if (req.body.type != null) {
    res.reward.type = req.body.type;
  }
  try {
    const updatedReward = await res.reward.save();
    res.json(updatedReward);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE A SPECIFIC REWARD
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    console.log(req.params.id);
    await Reward.findByIdAndRemove(req.params.id);
    res.json({ message: "Reward Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
