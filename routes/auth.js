const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../security/verifyToken");

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

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields", missingFields });
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

// login user
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

  // gera o token
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id }, secret);

  // guarda o token no documento do user
  user.token = token;
  await user.save();

  res.status(200).json({ message: "Logged in successfully", token });
});

// Logout user
router.post("/logout", verifyToken, async (req, res) => {
  try {
    // procura o user pelo id
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // limpa o token
    user.token = "";
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
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
