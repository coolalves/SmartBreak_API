const express = require("express");
const router = express.Router();
const Pause = require("../models/pausesModel");
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL PAUSES
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });
    const pauses = await Pause.find();
    res.status(200).json({ message: pauses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A PAUSE
router.post("/", verifyToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = await User.findOne({ token: token })
  const user_id = user.id

  const pause = new Pause({
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    user: user_id,
  });
  try {
    const newPause = await pause.save();
    res.status(201).json({ message: newPause, id: newPause._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC PAUSE
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const user_id = user.id
    const pause = await Pause.findById(req.params.id);

    if (!pause)
      return res.status(404).json({ message: "Cannot find pause" });

    if (pause.user != user_id)
      return res.status(403).json({ message: "Cannot access the content" });

    res.status(200).json({ message: pause });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC PAUSE
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const user_id = user.id
    const pause = await Pause.findById(req.params.id);

    if (!pause)
      return res.status(404).json({ message: "Cannot find pause" });

    if (pause.user != user_id)
      return res.status(403).json({ message: "Cannot access the content" });

    res.pause = pause;
    if (req.body.start_date != null) {
      res.pause.start_date = req.body.start_date;
    }
    if (req.body.end_date != null) {
      res.pause.end_date = req.body.end_date;
    }
    if (req.body.user != null) {
      res.pause.user = req.body.user;
    }
    const updatedPause = await res.pause.save();
    res.status(200).json({ message: updatedPause });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET USER PAUSES
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    //TODO: i don't know if only user can access themselves pauses or if admin also have access bc webtool
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const user_id = user.id

    if (req.params.id != user_id)
      return res.status(403).json({ message: "Cannot access the content" });

    const pauses = await Pause.find({ user: req.params.id });
    if (!pauses) {
      return res.status(404).json({ message: "Cannot find pauses" });
    }
    res.status(200).json({ message: pauses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET PAUSES BY DATA
router.get("/user/:id/date/:date", verifyToken, async (req, res) => {
  try {
    //TODO: i don't know if only user can access themselves pauses or if admin also have access bc webtool
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const user_id = user.id
    let pauses = [];

    if (req.params.id != user_id)
      return res.status(403).json({ message: "Cannot access the content" });

    const elements = await Pause.find({ user: req.params.id });

    if (!elements) {
      return res.status(404).json({ message: "Cannot find pauses" });
    }
    elements.forEach((element) => {
      if (element.start_date.toISOString().includes(req.params.date)) {
        pauses.push(element);
      }
    });
    res.status(200).json({ message: pauses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC PAUSE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    const user_id = user.id
    const pause = await Pause.findById(req.params.id);

    if (!pause)
      return res.status(404).json({ message: "Cannot find pause" });

    if (pause.user != user_id)
      return res.status(403).json({ message: "Cannot access the content" });
      
    await Pause.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Pause Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
