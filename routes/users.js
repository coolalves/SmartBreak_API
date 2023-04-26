const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const checkToken = require("../security/checkToken");
const passport = require("passport");

/////////////////////////////////////////////////////////////////
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

///////////////////////////////////////////////////////////

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

//ADD A USER
router.post("/register", async (req, res) => {
  const { name, surname, email, password, admin, department } = req.body;

  try {
    // Verifica se o email ja existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      admin,
      department,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// USER LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });

    // If the user is not found, return an error
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the entered password matches the user's password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create and return a JWT for the authenticated user
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_TOKEN);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
