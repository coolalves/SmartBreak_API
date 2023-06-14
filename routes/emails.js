const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");

//GET ALL EMAILS
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      const userData = users.map(user => ({ email: user.email, date_created: user.created }));
      res.status(200).json({ message: userData, total: users.length });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
