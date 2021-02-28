const transport = require('../config/nodemailer');

const sendInvitation = async(req, res) => {
  const {meetingId, mailTo, userName, date} = req.body
  let body = {
    from:'videochatapp.test@gmail.com',
    to: mailTo,
    subject: 'Meeting Invitation from Video App',
    html:`<h4>${userName} has sent you a invitation to join Meeting</h4></br><p>Meeting Details</p></br><ul><li>Meeting Link: <a href=https://zoom.clone.com?${meetingId} >https://zoom.clone.com?${meetingId}</a></li><li>Meeting ID: ${meetingId}</li><li>Scheduled at: ${date}</li></ul>`
  }
  transport.sendMail(body, (err, result)=>{
    console.log('email');
    if(err){
      console.log(err);
      res.send({status:501, message:'Email Not Sent'})
      return false
    }else{
      res.send({status:200, message:'Invitation Sent to Email'})
      console.log(result);
    }
  })
}

module.exports = {
  sendInvitation
}