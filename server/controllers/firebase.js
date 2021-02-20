const db = require('../config/firebase');
const {getMeetingId} = require('../helpers/meeting');

const getUser = async(req, res) => {
  res.send('Hello World');
}

const meetingID = async(req, res) => {
  const {uid} = req.body;
  const meetingId = getMeetingId();
  let postData = {
    uid,
    host:false,
    meetingId:meetingId,
  }
  try {
    await db.ref('users/'+uid).once('value').then((snapshot)=>{
      if(snapshot.exists()){
        res.send(snapshot.val());
      }else{
        db.ref('users/'+uid).set(postData);
        res.send(postData);
      }
    });
    await db.ref('meetings/'+meetingId).set({host:false});
  } catch (error) {
    res.send({status:501,error:error});
  }
}

const hostMeetingController = async(req, res) => {
  const {meetingId,host} = req.body;
  try {
    let data = await db.ref('meetings/'+meetingId).set({host:host});
    console.log(data);
    res.send({status:200,message:'Meeting Started'});
  } catch (error) {
    res.send({status:501,error:error})
  }
}


const joinRoom = async(req, res) =>{
  const {meetingId} = req.body;
  try {
    let snapshot = await db.ref('meetings/'+meetingId).once('value');
    if(snapshot.exists() && snapshot.val().host===false){
      res.send({status:204,message:"Host Not Started the meeting"})
    }
    else if(snapshot.exists() && snapshot.val().host===true){
      res.send({status:200, message:"You can Join Now"})
    }
    else{
      res.send({status:205, message:"Meeting ID you Entered is Wrong"})
    }
  } catch (error) {
    res.send({status:501,error:error});
  }
}

module.exports = {
  getUser,
  meetingID,
  hostMeetingController,
  joinRoom
}