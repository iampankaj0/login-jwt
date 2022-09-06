const express = require("express");
const router = express.Router();
const Model = require("../model/model");
const jwt = require("jsonwebtoken");

// REGISTER API
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  Model.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User Already registered" });
    } else {
      const user = new Model({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send({ message: err.message });
          res.status(400).json();
        } else {
          res.send({ message: "Successfully Registered" });
          res.status(200).json();
        }
      });
    }
  });
});

// LOGIN API
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  Model.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfully.", user });
      } else {
        res.send({ message: "Password didn't match." });
      }
    } else {
      res.send({ message: "User doesn't exist." });
    }
  });
});

// json web token fetch user
router.post("/jwt_fetchUser", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.send({ message: err.message });
      res.status(403).json();
    } else {
      res.send({
        message: "This is my userDetails",
        authData,
      });
    }
  });
});

// json web token login
router.post("/jwtlogin", (req, res) => {
  const { email, password } = req.body;
  Model.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        jwt.sign({ user }, "secretKey", { expiresIn: "24h" }, (err, token) => {
          if (err) {
            res.send({ message: err.message });
          } else {
            res.send({
              message: "Login Successfully",
              token,
            });
          }
        });
      } else {
        res.send({ message: "Password didn't match." });
      }
    } else {
      res.send({ message: "User doesn't exist." });
    }
  });
});

// Format of token
// Authorization: token <accexx_token>

//Token Verify Function'
function verifyToken(req, res, next) {
  // Get Authorization Header Value
  const bearerHeader = req.headers["authorization"];
  // check if bearer header is undefined or not
  if (typeof bearerHeader !== "undefined") {
    //split the space
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    // set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    res.status(403).json();
  }
}

module.exports = router;
