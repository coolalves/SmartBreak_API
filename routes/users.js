import checkToken from "../security/checkToken";

const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");

//GET ALL USERS
router.get("/", checkToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET ONE USER
router.get("/:id", checkToken, getUser, async (req, res) => {
  res.send(res.user);
});

//ADD ONE USER
router.post("/", checkToken, async (req, res) => {
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin,
    department: req.body.department,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//UPDATE ONE USER
router.patch("/:id", checkToken, getUser, async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.surname != null) {
    res.user.surname = req.body.surname;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.admin != null) {
    res.user.admin = req.body.admin;
  }
  if (req.body.battery != null) {
    res.user.battery = req.body.battery;
  }
  if (req.body.department != null) {
    res.user.department = req.body.department;
  }
  if (req.body.total_battery != null) {
    res.user.total_battery = req.body.total_battery;
  }
  if (req.body.pause != null) {
    res.user.pauses = req.body.pauses;
  }
  if (req.body.rewards != null) {
    res.user.rewards = req.body.rewards;
  }
  if (req.body.acessibility != null) {
    res.user.acessibility = req.body.acessibility;
  }
  if (req.body.notifications != null) {
    res.user.notifications = req.body.notifications;
  }
  if (req.body.permissions != null) {
    res.user.permissions = req.body.permissions;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE ONE USER
router.delete("/:id", checkToken, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ message: "User Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USERS FROM A DEPARTMENT
router.get("/department/:id", checkToken, async (req, res) => {
  try {
    const users = await User.find({ department: req.params.id });
    if (users == null) {
      return res.status(404).json({ message: "Cannot find users" });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
