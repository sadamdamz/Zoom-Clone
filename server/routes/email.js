const express = require('express');
const router = express.Router();
const template = require('../controllers/email');

router.post('/sendInvitation', template.sendInvitation);

module.exports = router;