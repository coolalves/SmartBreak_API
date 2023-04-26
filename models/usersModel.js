const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      required: true,
      default: Date.now,
    },
    battery: {
      type: Number,
      required: true,
      default: 0,
    },
    total_battery: {
      type: Number,
      required: true,
      default: 0,
    },
    pause: {
      type: Boolean,
      required: true,
      default: false,
    },
    department: {
      type: String,
      required: true,
    },

    rewards: {
      type: Array,
      required: true,
      default: [],
    },
    acessibility: {
      type: Array,
      required: true,
      default: [false, false],
    },
    permissions: {
      type: Array,
      required: true,
      default: [false, true],
    },
    notifications: {
      type: Array,
      required: true,
      default: [false, true, true, true],
    },
  },
  { collection: "Users" }
);

// Hash the password before saving the user
usersSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
});

module.exports = mongoose.model("User", usersSchema);
