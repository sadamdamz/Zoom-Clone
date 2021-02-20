const express = require('express');
const router = express.Router();
const firebase = require('../controllers/firebase');

router.post('/meetingroom', firebase.meetingID);
router.get('/', firebase.getUser);

module.exports = router;