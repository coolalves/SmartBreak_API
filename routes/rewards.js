const express = require("express");
const router = express.Router();
const Reward = require("../models/rewardsModel");
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL REWARDS
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const rewards = await Reward.find();
    res.status(200).json({ message: rewards, total: rewards.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A REWARD
router.post("/", verifyToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = await User.findOne({ token: token })
  if (!user.access)
    return res.status(403).json({ message: "Cannot access the content" });

  const reward = new Reward({
    description: req.body.description,
    type: req.body.type,
  });
  try {
    const newReward = await reward.save();
    res.status(201).json({ message: newReward, id: newReward._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC REWARD
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const rewards = await Reward.findById(req.params.id);
    if (!rewards) {
      return res.status(404).json({ message: "Cannot find reward" });
    }
    res.status(200).json({ message: rewards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET REWARDS BY TYPE
router.get("/type/:type", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const rewards = await Reward.find({ type: req.params.type });
    if (!rewards) {
      return res.status(404).json({ message: "Cannot find rewards" });
    }
    res.status(200).json({ message: rewards, total: rewards.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A REWARD BY ID
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });

    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: "Cannot find reward" });
    }
    res.reward = reward;
    if (req.body.description != null) {
      res.reward.description = req.body.description;
    }
    if (req.body.type != null) {
      res.reward.type = req.body.type;
    }
    const updatedReward = await res.reward.save();
    res.status(200).json({ message: updatedReward });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC REWARD
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });

    await Reward.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Reward Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
