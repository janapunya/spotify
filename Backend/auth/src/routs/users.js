const express = require('express')
const router = express.Router();
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const usercontroller = require('../controllers/user.controller')
const validation= require('../middlewares/validation.middlewares')

router.post('/checkuser',usercontroller.checkuser)

router.post('/createUser',upload.single('image'),validation.signUpDataValidation,usercontroller.create_user)

router.post('/login',usercontroller.login_user)

router.post('/updateUser',usercontroller.update_user)
router.patch('/createArtist',usercontroller.create_artist)

module.exports=router;