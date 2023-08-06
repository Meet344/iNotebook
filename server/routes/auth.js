const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
var fetchUser = require("../middleware/fetchUser");
const router = express.Router();

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "ThisAsecretThread";

//ROUTE1: Create a User using POST request "/api/auth/createuser" ""Doesn't require Auth""
router.post(
  "/createuser",
  [
    body("name", "Name must be of 3 letters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be min 3 letters").isLength({ min: 3 }),
  ],
  async (req, res) => {
    console.log(req.body);
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    //check whether user with same email exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, errors: "Sorry a user with same Email already exists" });
      }

      var salt = bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      var authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(success,error.messsage);
      return res.status(500).send("Some error Occured");
    }
  }
);

//ROUTE2: Authenticate the login using Post request to /api/auth/login "Auth required"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // Check whether there are any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      //check whether the user with given email exist
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success,errors: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success,errors: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      var authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,authtoken });
    } catch (error) {
      console.log(error.messsage);
      return res.status(500).send("Some error Occured");
    }
  }
);

//ROUTE3 : Get user using get request to /api/auth/getuser "Auth required"
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.messsage);
    return res.status(500).send("Some Internal Server Error Occured");
  }
});

module.exports = router;
