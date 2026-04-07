const playlist = require('../models/playlist.model');
const imagekit = require('../services/imagekit');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

function getBearerToken(req) {
    const header = req.headers?.authorization || req.headers?.Authorization;
    if (!header || typeof header !== 'string') return null;
    const [type, token] = header.split(' ');
    if (type !== 'Bearer') return null;
    return token || null;
}
async function Add_playlist(req, res) {
    try {
        const token = getBearerToken(req);
        if (!token) {
            return res.json(
                { stutas: false }
            )
        }
        const check = jwt.verify(token, process.env.JWT_COOKIE_SECRET);
        if (!check) {
            return res.json({
                stutas: false
            })
        }
        const { name } = req.body;
        const img = req.files.image[0];
        const [imageUrl] = await Promise.all([
            imagekit(img.buffer.toString('base64'), uuidv4())
        ])
        playlist.create({
            userId: check.id,
            name,
            imageUrl
        })
        return res.json({
            stutas: true
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            stutas: false
        })
    }
}

async function Playlistdata(req, res) {
    const token = getBearerToken(req);
    try {
        if (!token) {
            return res.json(
                { stutas: false }
            )
        }
        const check = jwt.verify(token, process.env.JWT_COOKIE_SECRET);
        if (!check) {
            return res.json({
                stutas: false
            })
        }
        const data = await playlist.find({ userId: check.id });
        return res.json({
            stutas: true,
            playListData: data
        })
    }catch (err) {
        console.error(err)
        return res.json({
            stutas:false
        })
    }
}

async function addSongPlaylist(req,res) {
    const {PlaylistId, SongId} = req.body;
    try{
        const updats =  await playlist.findOneAndUpdate({_id:PlaylistId},{$push:{songs:SongId}})
        if(updats){
            return res.json({
                stutas:true
            })
        }
        else{
            return res.json({
                stutas:false
            })
        }
    }catch(err){
        console.error(err)
        return res.json({
            stutas:false
        })
    }
}

async function delSongPlaylist(req,res) {
    const {PlaylistId,SongId} = req.body;
    try{
        const update = await playlist.findOneAndUpdate({_id:PlaylistId},{$pull:{songs:SongId}})
        if(update){
            return res.json({
                stutas:true
            })
        }
        else{
            return res.json({
                stutas:false
            })
        }
    }catch(err){
        console.error(err)
        return res.json({
            stutas:false
        })
    }
}

module.exports = {
    Add_playlist,
    Playlistdata,
    addSongPlaylist,
    delSongPlaylist
}