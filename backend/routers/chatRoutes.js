const express = require('express');
const { protect } = require('../Middleware/authMiddleware');
const {acessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../controllers/chatController');
// const { route } = require('./userRoutes');

const router = express.Router();

router.route('/').post(protect, acessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupadd').put(protect, addToGroup);
router.route('/groupremove').put(protect, removeFromGroup);

module.exports = router;