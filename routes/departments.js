const express = require("express");
const router = express.Router();
const Tip = require("../models/departmentsModel");

//GET ALL DEPARTMENTS
router.get("/", async (req, res) => {
  try {
    const departments = await Tip.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A DEPARTMENT
router.post("/", async (req, res) => {
  const department = new Tip({
    name: req.body.name,
    description: req.body.description,
    organization: req.body.organization,
  });
  try {
    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC DEPARTMENT
router.get("/:name", async (req, res) => {
  try {
    const departments = await Tip.find({ name: req.params.name });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC DEPARTMENT
router.patch("/:name", async (req, res) => {
  try {
    const department = await Tip.findOne({ name: req.params.name });
    if (req.body.name != null) {
      department.name = req.body.name;
    }
    if (req.body.description != null) {
      department.description = req.body.description;
    }
    if (req.body.organization != null) {
      department.organization = req.body.organization;
    }
    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE A SPECIFIC DEPARTMENT
router.delete("/:name", async (req, res) => {
  try {
    await Tip.findOneAndRemove({ name: req.params.name });
    res.json({ message: "Department Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
