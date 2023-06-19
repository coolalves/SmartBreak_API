const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/usersModel");
const Organization = require("../models/organizationsModel");
const Department = require("../models/departmentsModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../security/verifyToken");

// Register user
router.post("/register", async (req, res) => {
  const created = new Date();
  const userExists = await User.findOne({ email: req.body.email });

  const salt = await bcrypt.genSalt(12);
  const passwordToHash = req.body.password + created.toISOString(); //concatena a password com a data de criação do user
  const passwordHash = await bcrypt.hash(passwordToHash, salt); //encripta a password

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: passwordHash,
    admin: req.body.admin,
    department: req.body.department,
    organization: req.body.organization,
    created: created, //data de criação do user
    connected_in: created,
    access: req.body.access,
  });
  const missingFields = [];

  if (!req.body.name) {
    missingFields.push("name");
  }
  if (!req.body.surname) {
    missingFields.push("surname");
  }
  if (!req.body.email) {
    missingFields.push("email");
  }
  if (!req.body.password) {
    missingFields.push("password");
  }
  if (req.body.admin === undefined) {
    missingFields.push("admin");
  }
  if (!req.body.department) {
    missingFields.push("department");
  }
  if (!req.body.organization) {
    missingFields.push("organization");
  }

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields: " + missingFields });
  } else if (!userExists) {
    try {
      const newUser = await user.save();
      res.status(201).json({ message: newUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: "E-mail já em uso." });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const passwordToCheck = password + user.created.toISOString();
  const isMatch = await bcrypt.compare(passwordToCheck, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id }, secret);

  user.token = token;

  // Timezone: Europe/Lisbon
  const connectedIn = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Lisbon",
  });
  user.connected_in = connectedIn;

  console.log(user.organization);

  try {
    const userOrganization = await Organization.findById(
      new mongoose.Types.ObjectId(user.organization)
    );

    if (!userOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const userDepartment = await Department.findById(
      new mongoose.Types.ObjectId(user.department)
    );

    if (!userDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user,
      userOrganization,
      userDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout user
router.post("/logout/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    // encontra o user pelo id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // limpa o token
    user.token = null;
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//private route para ir buscar um user por id
router.get("/users/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    // vê se o user existe
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: user });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
