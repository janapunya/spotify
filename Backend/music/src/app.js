const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const musicrouter = require('./routs/add_song')
const playlistrouter = require('./routs/playlist')
app.use(cors({
    origin: 'https://vibetune-ten.vercel.app/',
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
app.use('/music',musicrouter);
app.use('/playlist',playlistrouter);

app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Music Server is running",
      uptime: process.uptime(), // seconds
      timestamp: new Date(),
    });
  });
module.exports = app;