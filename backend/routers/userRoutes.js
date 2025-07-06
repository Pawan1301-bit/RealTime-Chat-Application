const express = require('express');
const Router = express.Router();
const {registerUser, authUser, allUsers} = require('../controllers/userControllers');
const {protect} = require("../Middleware/authMiddleware");

Router.route('/').post(registerUser).get(protect, allUsers) //protect ensure that if the user is not login they cannot access the route
Router.post('/login', authUser)


module.exports = Router;