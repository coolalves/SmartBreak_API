const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");

//Registar user
router.post("/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin,
    department: req.body.department,
  });

  if (
    !user.name ||
    !user.surname ||
    !user.email ||
    !user.password ||
    !user.admin ||
    !user.department
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
