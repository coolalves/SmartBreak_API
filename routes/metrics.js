const express = require("express");
const router = express.Router();
const Metric = require("../models/metricsModel");
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL METRICS
router.get("/", verifyToken, async (req, res) => {
  try {
    const metrics = await Metric.find();
    res.status(200).json({ message: metrics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A METRIC
router.post("/", verifyToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = await User.findOne({ token: token })
  if (!user.access)
    return res.status(403).json({ message: "Cannot access the content" });

  const metric = new Metric({
    description: req.body.description,
    type: req.body.type,
  });
  try {
    const newMetric = await metric.save();
    res.status(201).json({ message: newMetric, id: newMetric._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC METRIC
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const metrics = await Metric.findById(req.params.id);
    if (!metrics) {
      return res.status(404).json({ message: "Cannot find metric" });
    }
    res.status(200).json({ message: metrics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC METRIC
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });
    await Metric.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Metric Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
