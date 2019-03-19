const config = require("config");
const jwt = require("jsonwebtoken");

//middleware function for private routing (replacing passport.js)
function auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    //verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    //take user id from token
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
    res.end();
  }
}

module.exports = auth;
