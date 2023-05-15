const jwt = require("jsonwebtoken");

//verificar token
module.exports = exports = function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret);

    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Invalid Token",
    });
  }
};
