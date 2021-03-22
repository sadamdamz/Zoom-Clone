const db = require('../config/firebase');
const {getMeetingId} = require('../helpers/meeting');
const template = require('./email');


const getUser = async (req, res) => {
  res.send('Hello World');
};

const getMeetingList = async(req, res)=> {
  const {uid} = req.body;
  console.log(req.body);
  try {
    await db
    .ref('users/' + uid)
    .once('value')
    .then((snapshot) => {
      console.log(snapshot.val())
      let val = snapshot.val();
      if(snapshot.exists()){
        res.send({status:200,Data:snapshot.val()});
      }else{
        db.ref('users/' + uid).set(req.body);
        res.send({status:203,Data:[]});
      }
    });
  } catch (error) {
    res.send({status:501,error:error});
  }
}

const meetingID = async (req, res) => {
  const {uid} = req.body;
  const meetingId = getMeetingId();
  let postData = {
    uid,
    host: false,
    meetingId: meetingId,
  };
  try {
    await db
      .ref('users/' + uid)
      .once('value')
      .then((snapshot) => {
        let val = snapshot.val();
        if(snapshot.exists()){
          db.ref('users/' + uid).set({...val,meetingId:meetingId});
          console.log(snapshot.val())
          res.send(snapshot.val());
        }else{
          console.log(snapshot.val())
          db.ref('users/' + uid).set(postData);
          res.send(postData);
        }
      });
  } catch (error) {
    res.send({status: 501, error: error});
  }
};

const hostMeetingController = async (req, res) => {
  const {meetingId, host, user} = req.body;
  let users = [user];
  try {
    let data = await db
      .ref('meetings/' + meetingId)
      .set({host: host, users: users});
    if (host) {
      res.send({status: 200, message: 'Meeting Started'});
    } else {
      res.send({status: 200, message: 'Meeting Ended'});
    }
  } catch (error) {
    res.send({status: 501, error: error});
  }
};

const joinRoom = async (req, res) => {
  const {meetingId, user} = req.body;
  try {
    let snapshot = await db.ref('meetings/' + meetingId).once('value');
    if (snapshot.exists() && snapshot.val().host === false) {
      res.send({status: 204, message: 'Host Not Started the meeting'});
    } else if (snapshot.exists() && snapshot.val().host === true) {
      let users = await db.ref('meetings/' + meetingId).once('value');
      let data = users.val();
      data.users = [...data.users, user];
      await db.ref('meetings/' + meetingId).set(data);
      res.send({status: 200, message: 'You can Join Now'});
    } else {
      res.send({status: 205, message: 'Meeting ID you Entered is Wrong'});
    }
  } catch (error) {
    res.send({status: 501, error: error});
  }
};

const getMeetingDetails = async (req, res) => {
  const {meetingId, user} = req.params;
  try {
    let data = await db.ref('meetings/' + meetingId).get();
    res.send({status: 200, message: 'Meeting Details', data: data});
  } catch (error) {
    res.send({status: 501, error: error});
  }
};

const endMeeting = async (req, res) => {
  const {meetingId, user} = req.body;
  try {
    let data = await db.ref('meetings/' + meetingId).once('value');
    let get = await data.val();
    let users = get.users.filter((item, index) => {
      return item.uid !== user.uid;
    });
    if (users.length == 0) {
      await db.ref('meetings/' + meetingId).remove();
      res.send({
        status: 200,
        message: `meetingId:${meetingId} Ended Successfully`,
      });
    } else {
      await db.ref('meetings/' + meetingId).set({host: true, users: users});
      res.send({
        status: 200,
        message: `user removed from the meeting ${meetingId}`,
      });
    }
  } catch (error) {
    res.send({status: 501, error: error});
  }
};

const scheduleMeeting = async(req, res) => {
  const {uid, mailTo} = req.body;
  let postData = {
    ...req.body,
    host: false,
    active: true,
  }
  console.log(postData);
  try {
    await db
      .ref('users/' + uid)
      .once('value')
      .then((snapshot) => {
        let val = snapshot.val();
        console.log(snapshot.val());
        db.ref('users/' + uid + '/meetings/' + val.meetingId).set({...postData,meetingId:val.meetingId,url:`http://wedgrab.com/meetingroom/${val.meetingId}`});
        if(mailTo.length>0){
          let data = template.sendInvitation({...postData,meetingId:val.meetingId})
          console.log(data);
        }
        res.send(postData);
      });
  } catch (error) {
    res.send({status: 501, error: error});
  }
}

const getInviteDetail = async(req, res) => {
  const {uid,meetingId} = req.body;
  try {
    await db.ref('users/'+uid+'/meetings/'+meetingId).once('value').then((snapshot)=>{
      let val = snapshot.val();
      res.send({status:200,data:val});
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUser,
  meetingID,
  hostMeetingController,
  joinRoom,
  endMeeting,
  getMeetingDetails,
  scheduleMeeting,
  getMeetingList,
  getInviteDetail
};
