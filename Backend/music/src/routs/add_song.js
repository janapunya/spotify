const express = require("express");
const router = express.Router();
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage()})
const music = require('../controllers/music.controllers')
router.post('/addsong',upload.fields([{ name: "image", maxCount: 1 },{ name: "audio", maxCount: 1 },]), music.Add_music);
router.get('/allsongs',music.allsongs);
router.post('/delete_song',music.delete_song);
router.get('/songs',music.songs);
module.exports = router;