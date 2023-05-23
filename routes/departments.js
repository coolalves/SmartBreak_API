const express = require("express");
const router = express.Router();
const Department = require("../models/departmentsModel");
const verifyToken = require("../security/verifyToken");

//GET ALL DEPARTMENTS
router.get("/", verifyToken, async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json({message: departments, total: departments.length});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A DEPARTMENT
router.post("/", verifyToken, async (req, res) => {
  const department = new Department({
    name: req.body.name,
    description: req.body.description,
    organization: req.body.organization,
  });
  try {
    const newDepartment = await department.save();
    res.status(201).json({message: newDepartment});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC DEPARTMENT
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const departments = await Department.findById(req.params.id);
    if (departments == null) {
      return res.status(404).json({ message: "Cannot find department" });
    }
    res.status(200).json({message: departments});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC DEPARTMENT
router.patch("/:id", verifyToken, async (req, res) => {
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
    res.status(200).json({message: updatedDepartment});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE A SPECIFIC DEPARTMENT
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Department.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Department Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET DEPARTMENTS FROM ORGANIZATION X
router.get("/organization/:id", verifyToken, async (req, res) => {
  try {
    const departments = await Department.find({ organization: req.params.id });
    if (departments == null) {
      return res.status(404).json({ message: "Cannot find departments" });
    }
    res.status(200).json({message: departments});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
