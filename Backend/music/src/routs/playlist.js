const express = require("express");
const router = express.Router();
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage()})
const playlist = require('../controllers/playlist.controllers')
router.post('/add_playlist',upload.fields([{ name: "image", maxCount: 1 },]), playlist.Add_playlist);
router.post('/playlistdata',playlist.Playlistdata)
router.post('/addsongplaylist',playlist.addSongPlaylist)
router.post('/delSongPlaylist',playlist.delSongPlaylist)
module.exports = router;