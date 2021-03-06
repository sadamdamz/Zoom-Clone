const express = require('express');
const router = express.Router();
const firebase = require('../controllers/firebase');

router.get('/', firebase.getUser);
router.post('/getMeetingList', firebase.getMeetingList);
router.post('/meetingroom', firebase.meetingID);
router.post('/joinroom', firebase.joinRoom);
router.post('/hostMeetingController', firebase.hostMeetingController);
router.get('/getMeetingDetails/:meetingId', firebase.getMeetingDetails);
router.post('/endMeeting', firebase.endMeeting);
router.post('/scheduleMeeting', firebase.scheduleMeeting);
router.post('/getInviteDetails', firebase.getInviteDetail);

module.exports = router;