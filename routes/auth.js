const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");

//Registar user
router.post("/register", async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: passwordHash,
    admin: req.body.admin,
    department: req.body.department,
  });

  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.password ||
    !req.body.admin ||
    !req.body.department
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  } else if (!userExists) {
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: "User already exists" });
  }
});

//login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Logged in successfully" });
});

module.exports = router;
