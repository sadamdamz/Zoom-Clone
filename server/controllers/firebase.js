const db = require('../config/firebase');
const {getMeetingId} = require('../helpers/meeting');

const getUser = async(req, res) => {
  res.send('Hello World');
}

const meetingID = async(req, res) => {
  const {uid} = req.body;
  let postData = {
    uid,
    host:false,
    meetingId:getMeetingId(),
  }
  try {
    await db.ref('users/'+uid).once('value').then((snapshot)=>{
      let value = snapshot.val();
      if(value==null){
        db.ref('users/'+uid).set(postData);
        res.send(postData);
      }else{
        res.send(value)
      }
    });
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  getUser,
  meetingID
}