import {API_URL} from "@env";
import axios from 'react-native-axios';

export const getMeetingId = async(postData) => {
  try {
    let api = await axios.post(`http://192.168.43.20:5000/api/v1/meetingroom`,postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const hostMeetingController = async(postData) => {
  try {
    let api = await axios.post(`http://192.168.43.20:5000/api/v1/hostMeetingController`,postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const joinMeetingRoom = async(postData) => {
  try {
    let api = await axios.post(`http://192.168.43.20:5000/api/v1/joinroom`,postData);
    let response = await api.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}