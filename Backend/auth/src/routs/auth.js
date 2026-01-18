const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt =require('jsonwebtoken');

// Step 1: Start Google login
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"],session:false })
  );
  
  // Step 2: Google redirects here
  router.get("/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173",session:false }),
    (req, res) => {
      const user = req.user;
      const token = jwt.sign({email:user.email,id:user._id},process.env.JWT_COOKIE_SECRET,{expiresIn: "1d"});
      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 86400000,
      });
      res.redirect('http://localhost:5173')
    }
  );
  
  // Logout route
  router.get("/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });



//   router.post('/checkuser',authcontroller.checkuser)

  module.exports = router;