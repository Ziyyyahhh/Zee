const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/', userController.getBlog)
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.post('/blog/getOne', userController.getSingleBlog)



module.exports = router