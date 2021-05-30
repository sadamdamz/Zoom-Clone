// import {API_URL} from "@env";
import axios from 'react-native-axios';
import { Constant } from '../constants/index';

const API_URL = Constant.endPoints.API_URL;


const getMeetingList = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/getMeetingList`,postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

const getTimeZones = async() => {
  try {
    let api = await axios.get(`http://api.timezonedb.com/v2.1/list-time-zone?key=UK16MNB2WVFJ&format=json`);
    let response = await api.data.zones;
    return response
  } catch (error) {
    console.log(error);
  }
}

const getMeetingId = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/meetingroom`,postData);
    let response = await api.data;
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

const getInviteDetails = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/getInviteDetails`,postData);
    let response = await api.data;
    return response
  } catch (error) {
    console.log(error);
  }
}

const scheduleMeeting = async(postData) => {
  try {
    let api = await axios.post(`${API_URL}/api/v1/scheduleMeeting`,postData);
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
  endMeeting,
  scheduleMeeting,
  getMeetingList,
  getInviteDetails,
  getTimeZones
}