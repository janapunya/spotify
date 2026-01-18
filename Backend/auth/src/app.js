const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const passport = require('./services/google_auth')
const users = require('./routs/users')
const auth = require('./routs/auth')
const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',auth)
app.use('/users',users)

module.exports = app;