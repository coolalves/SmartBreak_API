const express = require("express");
const router = express.Router();
const Department = require("../models/departmentsModel");
const checkToken = require("../security/checkToken");

//GET ALL DEPARTMENTS
router.get("/", checkToken, async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A DEPARTMENT
router.post("/", checkToken, async (req, res) => {
  const department = new Department({
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
router.get("/:id", checkToken, async (req, res) => {
  try {
    const departments = await Department.findById(req.params.id);
    if (departments == null) {
      return res.status(404).json({ message: "Cannot find department" });
    }
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC DEPARTMENT
router.patch("/:id", checkToken, async (req, res) => {
  let department;
  try {
    department = await Department.findById(req.params.id);
    if (department == null) {
      return res.status(404).json({ message: "Cannot find department" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.department = department;

  if (req.body.name != null) {
    department.name = req.body.name;
  }
  if (req.body.description != null) {
    department.description = req.body.description;
  }
  if (req.body.organization != null) {
    department.organization = req.body.organization;
  }
  try {
    const updatedDepartment = await res.department.save();
    res.json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE A SPECIFIC DEPARTMENT
router.delete("/:id", checkToken, async (req, res) => {
  try {
    await Department.findByIdAndRemove(req.params.id);
    res.json({ message: "Department Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET DEPARTMENTS FROM ORGANIZATION X
router.get("/organization/:id", checkToken, async (req, res) => {
  try {
    const departments = await Department.find({ organization: req.params.id });
    if (departments == null) {
      return res.status(404).json({ message: "Cannot find departments" });
    }
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
