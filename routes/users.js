const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const Department = require("../models/departmentsModel");
const Organization = require("../models/organizationsModel");
const Reward = require("../models/rewardsModel");

const verifyToken = require("../security/verifyToken");

//GET ALL USERS
router.get("/", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    if (!user.access)
      return res.status(403).json({ message: "Cannot access the content" });

    const users = await User.find();
    res.status(200).json({ message: users, total: users.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/rewards/:user_id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findById(req.params.user_id);

    let rewards = []
    const user_rewards = user.rewards;
    console.log("rewards" , user_rewards)

    for (const id of user_rewards) {
      let reward = await getRewards(id);
      rewards.push(reward);
    }
    console.log(rewards)
    res.status(200).json({ message: rewards, total: rewards.length });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

async function getRewards(id) {
  return await Reward.findById(id)
}



//GET ONE USER
router.get("/:id", verifyToken, async (req, res) => {
  try {
    console.log(req.params.id)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token)
    const user = await User.findOne({ _id: req.params.id })
    // if (user.id != req.params.id)
    //   return res.status(403).json({ message: "Cannot access the content" });

    res.status(200).json({ message: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//UPDATE ONE USER
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    let user;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    user = await User.findOne({ token: token })

    if (!user)
    return res.status(404).json({ message: "User doesn't exist" });

    // if (user.id != req.params.id)
    //   return res.status(403).json({ message: "Cannot access the content" });

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
      res.user.pause = req.body.pause;
    }
    if (req.body.rewards != null) {
      res.user.rewards = req.body.rewards;
    }
    if (req.body.accessibility != null) {
      res.user.accessibility = req.body.accessibility;
    }
    if (req.body.notifications != null) {
      res.user.notifications = req.body.notifications;
    }
    if (req.body.permissions != null) {
      res.user.permissions = req.body.permissions;
    }
    try {
      const updatedUser = await res.user.save();
      res.status(200).json({ message: updatedUser });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE ONE USER
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    // if ((user.id != req.params.id) || (!user.admin))
    //   return res.status(403).json({ message: "Cannot access the content" });

    await User.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "User Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USERS FROM A DEPARTMENT
router.get("/department/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })

    if (user.department != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    const users = await User.find({ department: req.params.id });
    const department = await Department.findById(req.params.id);
    const department_name = department.name;
    const department_description = department.description
    res.status(200).json({ message: users, total: users.length, department: department_name, description: department_description });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET USERS FROM A ORGANIZATION
router.get("/organization/:id", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })

    if (user.organization != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });

    const users = await User.find({ organization: req.params.id });
    const organization = await Organization.findById(req.params.id);
    const organization_name = organization.name;
    res.status(200).json({ message: users, total: users.length, organization: organization_name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//GET THE USERS BY PAGE
router.get("/department/:id/page/:page", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = await User.findOne({ token: token })
    
    if (user.department != req.params.id)
      return res.status(403).json({ message: "Cannot access the content" });
   
    if (isNaN(req.params.page))
      return res.status(400).json({ message: req.params.page + " is not a number" });

    const users = await User.find({ department: req.params.id });

    const totalPages = Math.floor(users.length / 10) + 1

    res.status(200).json({ total_pages: totalPages, results: users.slice((req.params.page - 1) * 10, req.params.page * 10) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
