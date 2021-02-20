const express = require('express');
const router = express.Router();
const firebase = require('../controllers/firebase');

router.get('/', firebase.getUser);
router.post('/meetingroom', firebase.meetingID);
router.post('/joinroom', firebase.joinRoom);
router.post('/hostMeetingController', firebase.hostMeetingController);

module.exports = router;