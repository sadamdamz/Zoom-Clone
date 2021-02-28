// import {API_URL} from "@env";
import axios from 'react-native-axios';

// const API_URL = 'http://192.168.43.20:5000';

// const API_URL = 'http://192.168.0.103:5000';

const API_URL = `http://139.59.34.203:5000`;


const getMeetingId = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/meetingroom`,postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

const hostMeetingController = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/hostMeetingController`,postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

const joinMeetingRoom = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/joinroom`,postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

const getMeetingDetailById = async(id) => {
  try {
    let api = await axios.get(`${API_URL}/api/v1/getMeetingDetails/${id}`);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

const sendInvitationEmail = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/mail/sendInvitation`, postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

const endMeeting = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/endMeeting`, postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default {
  getMeetingId,
  hostMeetingController,
  joinMeetingRoom,
  getMeetingDetailById,
  sendInvitationEmail,
  endMeeting
}