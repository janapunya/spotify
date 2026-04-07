const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');        // ✅ added
const passport = require('./services/google_auth');
const session = require("express-session");
const users = require('./routs/users');
const auth = require('./routs/auth');

app.use(cors({
  origin: 'https://vibetune-ten.vercel.app',
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

app.use(cookieParser());        // ✅ before session
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 86400000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', auth);
app.use('/users', users);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Server is running",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

module.exports = app;