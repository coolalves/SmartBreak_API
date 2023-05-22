const express = require("express");
const router = express.Router();
const Device = require("../models/devicesModel");
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL DEVICES
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });

    const devices = await Device.find();
    res.status(200).json({message: devices});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A DEVICE
router.post("/", verifyToken, async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const user_id = user.id

  const device = new Device({
    name: req.body.name,
    energy: req.body.energy,
    type: req.body.type,
    user: user_id,
  });
  try {
    const newDevice = await device.save();
    res.status(201).json({message: newDevice});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC DEVICE
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const device = await Device.findById(req.params.id);

    if (!device) 
      return res.status(404).json({ message: "Cannot find device" });
    
    if (user.id != device.user) 
      return res.status(403).json({ message: "Cannot access the content" });

    res.status(200).json({message: device});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC DEVICE
router.patch("/:id", verifyToken, async (req, res) => {
  let device;
  try {
    device = await Device.findById(req.params.id);
    if (device == null) {
      return res.status(404).json({ message: "Cannot find device" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.device = device;
  if (req.body.name != null) {
    res.device.name = req.body.name;
  }
  if (req.body.type != null) {
    res.device.type = req.body.type;
  }
  if (req.body.state != null) {
    res.device.state = req.body.state;
  }
  if (req.body.energy != null) {
    res.device.energy = req.body.energy;
  }
  try {
    const updateDevice = await res.device.save();
    res.status(200).json({message: updateDevice});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET USER DEVICES
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const devices = await Device.find({ user: req.params.id });
    if (devices == null) {
      return res.status(404).json({ message: "Cannot find devices" });
    }
    res.status(200).json({message: devices});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC DEVICE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Device.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Device Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
