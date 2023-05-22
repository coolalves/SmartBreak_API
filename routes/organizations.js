const express = require("express");
const router = express.Router();
const Organization = require("../models/organizationsModel");
const verifyToken = require("../security/verifyToken");

//GET ALL ORGANIZATIONS
router.get("/", verifyToken, async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json({message: organizations});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A ORGANIZATION
router.post("/", verifyToken, async (req, res) => {
  const organization = new Organization({
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
  });
  try {
    const newOrganization = await organization.save();
    res.status(201).json({message: newOrganization});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC ORGANIZATION
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (organization == null) {
      return res.status(404).json({ message: "Cannot find organization" });
    }
    res.status(200).json({message: organization});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC ORGANIZATION
router.patch("/:id", verifyToken, async (req, res) => {
  let organization;
  try {
    organization = await Organization.findById(req.params.id);
    if (organization == null) {
      return res.status(404).json({ message: "Cannot find organization" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.organization = organization;
  if (req.body.name != null) {
    res.organization.name = req.body.name;
  }
  if (req.body.address != null) {
    res.organization.address = req.body.address;
  }
  if (req.body.phone_number != null) {
    res.organization.phone_number = req.body.phone_number;
  }
  if (req.body.battery_full != null) {
    res.organization.battery_full = req.body.battery_full;
  }
  try {
    const updatedOrganization = await res.organization.save();
    res.status(200).json({message: updatedOrganization});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE A SPECIFIC ORGANIZATION
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Organization.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Organization Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
