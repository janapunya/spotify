const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    songs:{
        type:Array,
        default:[]
    }
},{
    timestamps:true
});
const playlist = mongoose.model('playlist',playlistSchema)
module.exports = playlist;