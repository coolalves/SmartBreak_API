const express = require("express");
const router = express.Router();
const Goal = require("../models/goalsModel");
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL GOALS
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });
    const goals = await Goal.find();
    res.status(200).json({ message: goals,total: goals.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A GOAL
router.post("/", verifyToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = await User.findOne({ token: token })
  if (!user.admin)
    return res.status(403).json({ message: "Cannot access the content" });

  const goal = new Goal({
    description: req.body.description,
    destination: req.body.destination,
    organization: user.organization,
    priority: req.body.priority,
    date: req.body.date,
    types: req.body.types,
    active: req.body.active,
  });
  try {
    const newGoal = await goal.save();
    res.status(201).json({ message: newGoal, id: newGoal._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ORGANIZATION GOALS
router.get("/organization/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });
    if (user.organization != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    const goals = await Goal.find({ organization: req.params.id });
    res.status(200).json({ message: goals, total: goals.length});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ORGANIZATION ACTIVE GOALS
router.get("/organization/:id/active", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });
    if (user.organization != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    const goals = await Goal.find({ organization: req.params.id, active: true });
    res.status(200).json({ message: goals, total: goals.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ORGANIZATION INACTIVE GOALS
router.get("/organization/:id/inactive", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });
    if (user.organization != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    const goals = await Goal.find({ organization: req.params.id, active: false });
    res.status(200).json({ message: goals, total: goals.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER_ID/DEPARTMENT_ID GOALS ACTIVE
router.get("/destination/:id/active", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (user.id != req.params.id && user.department != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    let goals = [];
    const elements = await Goal.find({ organization: user.organization });
    elements.forEach((element) => {
      if (element.destination.includes(req.params.id) && (element.active))
        goals.push(element);
    });
    res.status(200).json({ message: goals, total: goals.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER_ID/DEPARTMENT_ID GOALS INACTIVE
router.get("/destination/:id/inactive", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (user.id != req.params.id && user.department != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    let goals = [];
    const elements = await Goal.find({ organization: user.organization });
    elements.forEach((element) => {
      if (element.destination.includes(req.params.id) && (!element.active))
        goals.push(element);
    });

    res.status(200).json({ message: goals, total: goals.length});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET GOALS SORT BY FILTER
router.get("/destination/:id/filter/:filter", verifyToken, async (req, res) => {
  let goals = [];
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (user.id != req.params.id && user.department != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    const elements = await Goal.find({ organization: user.organization });
    elements.forEach((element) => {
      if (element.destination.includes(req.params.id) && (element.active))
        goals.push(element);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  let filter = req.params.filter;

  if (filter == 0) {
    goals.sort((a, b) => a.date - b.date);
  } else if (filter == 1) {
    goals.sort((a, b) => b.date - a.date);
  } else if (filter == 2) {
    goals.sort((a, b) => a.priority - b.priority);
  } else if (filter == 3) {
    goals.sort((a, b) => b.priority - a.priority);
  } else {
    return res.status(404).json({ message: "Cannot find filter" });
  }
  res.status(200).json({ message: goals, filter: filter , total: goals.length});
});

//GET A SPECIFIC GOAL
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })

    const goal = await Goal.findById(req.params.id);
    if (!goal)
      return res.status(404).json({ message: "Cannot find goal" });

    if (goal.organization != user.organization)
      return res.status(403).json({ message: "Cannot access the content" });

    if (!goal.destination.includes(user.id) && !goal.destination.includes(user.department))
      return res.status(403).json({ message: "Cannot access the content" });

    res.status(200).json({ message: goal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC GOAL
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })

    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const goal = await Goal.findById(req.params.id);
    if (goal.organization != user.organization)
      return res.status(403).json({ message: "Cannot access the content" });

    if (!goal)
      return res.status(404).json({ message: "Cannot find goal" });

    res.goal = goal;
    if (req.body.description != null) {
      res.goal.description = req.body.description;
    }
    if (req.body.destination != null) {
      res.goal.destination = req.body.destination;
    }
    if (req.body.priority != null) {
      res.goal.priority = req.body.priority;
    }
    if (req.body.date != null) {
      res.goal.date = req.body.date;
    }
    if (req.body.active != null) {
      res.goal.active = req.body.active;
    }
    if (req.body.types != null) {
      res.goal.types = req.body.types;
    }
    const updatedGoal = await res.goal.save();
    res.status(200).json({ message: updatedGoal });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC GOAL
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })

    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const goal = await Goal.findById(req.params.id);
    if (goal.organization != user.organization)
      return res.status(403).json({ message: "Cannot access the content" });
    
    await Goal.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Goal Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
