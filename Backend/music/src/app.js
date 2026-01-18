const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const musicrouter = require('./routs/add_song')


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}))
app.use(cookieParser());

app.use(express.json());
app.use('/music',musicrouter);




module.exports = app;