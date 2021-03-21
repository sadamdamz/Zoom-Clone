const transport = require('../config/nodemailer');

const sendInvitation = async(postData) => {
  const {meetingId, mailTo, userName, date, topic, time } = postData
  let body = {
    from:'videochatapp.test@gmail.com',
    to: mailTo,
    subject: 'Meeting Invitation from Video App',
    html:`<h2>${userName} has sent you a invitation to join Meeting</h2></br><h5>Meeting Details</h5></br><p>Topic : ${topic}</p></br><ul><li>Meeting Link: <a href=http://wedgrab.com/meetingroom?${meetingId} >http://wedgrab.com/meetingroom?${meetingId}</a></li><li>Meeting ID: ${meetingId}</li><li>Scheduled at: ${date}</li><li>Time: ${time}</li></ul>`
  }
  transport.sendMail(body, (err, result)=>{
    console.log('email');
    if(err){
      return{
        status:'failed',
        errors:err,
        code:501,
      }
    }else{
      return{
        status:'success',
        data:result,
        code:200
      }
    }
  })
}

module.exports = {
  sendInvitation
}