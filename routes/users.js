const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL USERS
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.find({token : token})
    console.log(user.message['access'])

    const users = await User.find();
    if (users == null) {
      return res.status(404).json({ message: "Cannot find users" });
    }
    res.status(200).json({message: user});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET ONE USER
router.get("/:id", verifyToken, getUser, async (req, res) => {
  res.status(200).json({message: res.user});
});

//UPDATE ONE USER
router.patch("/:id", verifyToken, getUser, async (req, res) => {
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
  if (req.body.accessibility != null) {
    res.user.accessibility = req.body.accessibility;
  }
  if (req.body.notifications != null) {
    res.user.notifications = req.body.notifications;
  }
  if (req.body.permissions != null) {
    res.user.permissions = req.body.permissions;
  }
  try {
    const updatedUser = await res.user.save();
    res.status(200).json({message: updatedUser});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE ONE USER
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "User Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USERS FROM A DEPARTMENT
router.get("/department/:id", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ department: req.params.id });
    if (users == null) {
      return res.status(404).json({ message: "Cannot find users" });
    }
    res.status(200).json({message: users});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//GET THE USERS BY PAGE
router.get("/department/:id/page/:page", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ department: req.params.id });
    if (users == null) {
      return res.status(404).json({ message: "Cannot find users" });
    }
    if (isNaN(req.params.page))
      return res.status(400).json({ message: req.params.page + " is not a number" });

    const totalPages = Math.floor(users.length/10) + 1 

    res.status(200).json({total_pages: totalPages, results: users.slice((req.params.page - 1) *10, req.params.page*10)});
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
