const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'videoChatApp.test@gmail.com',
    pass: 'video@123'
  }
})

module.exports = transport;