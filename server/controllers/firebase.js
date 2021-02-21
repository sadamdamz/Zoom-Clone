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
        db.ref('users/'+uid).set(postData);
        res.send(postData);
    });
  } catch (error) {
    res.send({status:501,error:error});
  }
}

const hostMeetingController = async(req, res) => {
  const {meetingId,host,user} = req.body;
  let users = [user];
  try {
    let data = await db.ref('meetings/'+meetingId).set({host:host,users:users});
    if(host){
      res.send({status:200,message:'Meeting Started'});
    }else{
      res.send({status:200,message:'Meeting Ended'});
    }
  } catch (error) {
    res.send({status:501,error:error})
  }
}


const joinRoom = async(req, res) =>{
  const {meetingId, user} = req.body;
  try {
    let snapshot = await db.ref('meetings/'+meetingId).once('value');
    if(snapshot.exists() && snapshot.val().host===false){
      res.send({status:204,message:"Host Not Started the meeting"})
    }
    else if(snapshot.exists() && snapshot.val().host===true){
      let users = await db.ref('meetings/'+meetingId).once('value');
      let data = users.val();
      data.users = [...data.users, user];
      await db.ref('meetings/'+meetingId).set(data);
      res.send({status:200, message:"You can Join Now"})
    }
    else{
      res.send({status:205, message:"Meeting ID you Entered is Wrong"})
    }
  } catch (error) {
    res.send({status:501,error:error});
  }
}

const getMeetingDetails = async(req,res) => {
  const {meetingId, user} = req.params;
  try {
    let data = await db.ref('meetings/'+meetingId).get();
    res.send({status:200, message:'Meeting Details', data:data});
  } catch (error) {
    res.send({status:501,error:error});
  }
}

const endMeeting = async(req, res) => {
  const {meetingId, user} = req.body;
  try {
    let get = await db.ref('meetings/'+meetingId).get().val();
    if(get.users.length==0){
      await db.ref('meetings/'+meetingId).remove()
    }else{
      let users = get.users.filter((item,index)=>{
        return item.uid !== user.uid;
      })
      await db.ref('meetings/'+meetingId).set({host:true,users:users});
    }
    res.send({status:200, message:`meetingId:${meetingId} Ended Successfully`})
  } catch (error) {
    res.send({status:501,error:error});
  }
}

module.exports = {
  getUser,
  meetingID,
  hostMeetingController,
  joinRoom,
  endMeeting,
  getMeetingDetails
}