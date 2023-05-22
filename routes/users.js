const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL USERS
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.find({ token: token })
    if (!user[0].access)
      return res.status(403).json({ message: "Cannot access the content" });

    const users = await User.find();
    res.status(200).json({ message: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET ONE USER
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (user.id != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    res.status(200).json({ message: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//UPDATE ONE USER
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    let user;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    user = await User.findOne({ token: token })
    if (user.id != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    if (req.body.name != null) {
      user.name = req.body.name;
    }
    if (req.body.surname != null) {
      user.surname = req.body.surname;
    }
    if (req.body.email != null) {
      user.email = req.body.email;
    }
    if (req.body.password != null) {
      user.password = req.body.password;
    }
    if (req.body.admin != null) {
      user.admin = req.body.admin;
    }
    if (req.body.battery != null) {
      user.battery = req.body.battery;
    }
    if (req.body.department != null) {
      user.department = req.body.department;
    }
    if (req.body.total_battery != null) {
      user.total_battery = req.body.total_battery;
    }
    if (req.body.pause != null) {
      user.pause = req.body.pause;
    }
    if (req.body.rewards != null) {
      user.rewards = req.body.rewards;
    }
    if (req.body.accessibility != null) {
      user.accessibility = req.body.accessibility;
    }
    if (req.body.notifications != null) {
      user.notifications = req.body.notifications;
    }
    if (req.body.permissions != null) {
      user.permissions = req.body.permissions;
    }
    try {
      const updatedUser = await user.save();
      res.status(200).json({ message: updatedUser });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(200).json({ message: users });
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

    const totalPages = Math.floor(users.length / 10) + 1

    res.status(200).json({ total_pages: totalPages, results: users.slice((req.params.page - 1) * 10, req.params.page * 10) });
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
