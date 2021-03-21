const transport = require('../config/nodemailer');
const ical = require('ical-generator');

function getIcalObjectInstance(
  starttime,
  summary,
  name,
  url,
  email,
) {
  const cal = ical({
    domain: 'wedgrab.com',
    name: 'calendar event',
  });
  cal.domain('mytestwebsite.com');
  cal.createEvent({
    start: starttime, // eg : moment()
    summary: summary, // 'Summary of your event'
    url: url, // 'event url'
    organizer: {
      name: name,
      email: email,
    },
  });
  return cal;
}

const sendInvitation = async (postData) => {
  const {meetingId, mailTo, userName, date, topic, time, momentDate} = postData;
  let url = `http://wedgrab.com/meetingroom?${meetingId}`;
  let email = 'videochatapp.test@gmail.com'
  let calendarObj = getIcalObjectInstance(momentDate, topic, userName, url, email);
  console.log(calendarObj);
  let alternatives = {
    'Content-Type': 'text/calendar',
    method: 'REQUEST',
    content: new Buffer(calendarObj.toString()),
    component: 'VEVENT',
    'Content-Class': 'urn:content-classes:calendarmessage',
  };

  let body = {
    from: 'videochatapp.test@gmail.com',
    to: mailTo,
    subject: 'Meeting Invitation from Video App',
    html: `<h2>${userName} has sent you a invitation to join Meeting</h2></br><h5>Meeting Details</h5></br><p>Topic : ${topic}</p></br><ul><li>Meeting Link: <a href=http://wedgrab.com/meetingroom?${meetingId} >http://wedgrab.com/meetingroom?${meetingId}</a></li><li>Meeting ID: ${meetingId}</li><li>Scheduled at: ${date}</li><li>Time: ${time}</li></ul>`,
  };
  body['alternatives'] = alternatives;
  body['alternatives']['contentType'] = 'text/calendar';
  body['alternatives']['content'] = new Buffer(calendarObj.toString());
  transport.sendMail(body, (err, result) => {
    console.log('email');
    if (err) {
      return {
        status: 'failed',
        errors: err,
        code: 501,
      };
    } else {
      return {
        status: 'success',
        data: result,
        code: 200,
      };
    }
  });
};

module.exports = {
  sendInvitation,
};
