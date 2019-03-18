const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//User Model
const User = require("../../models/User");

// @route POST api/users
// @desc  Register User
// @access Public
router.post("/", (req, res) => {
  const { name, email, password, role, nric } = req.body;

  //Simple validation
  if (!name || !email || !password || !role || !nric) {
    return res.status(400).json({ msg: "Please enter all fields!" });
  }

  //Check for existing user
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({
        msg: "User already exists!"
      });
    }
    const newUser = User({ name, email, role, nric, password });

    //Create salt & hash for hashing password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          //sign json web token with id and return token + user
          jwt.sign(
            {
              id: user.id
            },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  nric: user.nric,
                  role: user.role
                }
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
