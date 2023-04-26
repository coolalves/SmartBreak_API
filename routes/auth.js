const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  //try catch
  try {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

//verificar token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret);

    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Invalid Token",
    });
  }
}

//private route para ir buscar um user por id
//DEPOIS IMPLEMENTAR ESTA VERSÃO
router.get("/users/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  //check if user exists
  const user = await User.findById(id, "-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json(user);
  }

  res.status(200).json({ user });
});

module.exports = router;
