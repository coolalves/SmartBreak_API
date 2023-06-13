const express = require("express");
const router = express.Router();
const Organization = require("../models/organizationsModel");
const User = require("../models/usersModel");
const verifyToken = require("../security/verifyToken");

//GET ALL ORGANIZATIONS
router.get("/", async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json({ message: organizations, total: organizations.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//ADD A ORGANIZATION
router.post("/", verifyToken, async (req, res) => {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  // const user = await User.findOne({ token: token })
  // if (!user.admin)
  //   return res.status(403).json({ message: "Cannot access the content" });
  const organization = new Organization({
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
  });
  try {
    const newOrganization = await organization.save();
    res.status(201).json({ message: newOrganization, id: newOrganization._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//GET A SPECIFIC ORGANIZATION
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const organization = await Organization.findById(req.params.id);

    if (!organization)
      return res.status(404).json({ message: "Cannot find department" });

    if (user.organization != organization.id)
      return res.status(403).json({ message: "Cannot access the content" });


    res.status(200).json({ message: organization });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT A SPECIFIC ORGANIZATION
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const organization = await Organization.findById(req.params.id);

    if (!organization)
      return res.status(404).json({ message: "Cannot find department" });

    if (user.organization != organization.id)
      return res.status(403).json({ message: "Cannot access the content" });

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
    const updatedOrganization = await res.organization.save();
    res.status(200).json({ message: updatedOrganization });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE A SPECIFIC ORGANIZATION
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.admin)
      return res.status(403).json({ message: "Cannot access the content" });

    const organization = await Organization.findById(req.params.id);

    if (!organization)
      return res.status(404).json({ message: "Cannot find department" });

    if (user.organization != organization.id)
      return res.status(403).json({ message: "Cannot access the content" });
      
    await Organization.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Organization Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
