const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const headerToken = req.header("x-auth-token");
  const bearer = req.header("Authorization");
  const token =
    headerToken ||
    (bearer && bearer.startsWith("Bearer ") ? bearer.slice(7) : null);
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
