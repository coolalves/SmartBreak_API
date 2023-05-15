const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// verificar token
module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, secret);

    // anexa o decoded payload ao request object
    req.user = decoded;

    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid Token" });
  }
};
