const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const Department = require("../models/departmentsModel");
const verifyToken = require("../security/verifyToken");

//GET ALL DEPARTMENTS
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });
    const departments = await Department.find({ });
    res.status(200).json({ message: departments, total: departments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A DEPARTMENT
router.post("/", verifyToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = await User.findOne({ token: token })
  if (!user.admin)
    return res.status(403).json({ message: "Cannot access the content" });
  const department = new Department({
    name: req.body.name,
    description: req.body.description,
    organization: user.organization,
  });
  try {
    const newDepartment = await department.save();
    res.status(201).json({ message: newDepartment, id: newDepartment._id  });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC DEPARTMENT
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const department = await Department.findById(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Cannot find department" });

    if (user.organization != department.organization)
      return res.status(403).json({ message: "Cannot access the content" });

    res.status(200).json({ message: department });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC DEPARTMENT
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const department = await Department.findById(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Cannot find department" });

    if (user.organization != department.organization)
      return res.status(403).json({ message: "Cannot access the content" });

    res.department = department;

    if (req.body.name != null) {
      department.name = req.body.name;
    }
    if (req.body.description != null) {
      department.description = req.body.description;
    }
    const updatedDepartment = await res.department.save();
    res.status(200).json({ message: updatedDepartment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC DEPARTMENT
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const department = await Department.findById(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Cannot find department" });

    if (user.organization != department.organization)
      return res.status(403).json({ message: "Cannot access the content" });


    await Department.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Department Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET DEPARTMENTS FROM ORGANIZATION X
router.get("/organization", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });
    const departments = await Department.find({ organization: user.organization });
    res.status(200).json({ message: departments, total: departments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
