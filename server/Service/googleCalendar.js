const {google} = require('googleapis');
require('dotenv').config();

const text =   {type: "service_account",project_id: "video-app-4f774",private_key_id: "4b2650d6e0bfabdee0989c88f8352970c15aa95e",private_key: "-----BEGIN PRIVATEKEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0XolUZCcxoCv9\nqj6aTqQU74nvDSEQZjNvzCPLAq2B1VqNJ2WfwmaIYiIhemgCHyzuBEfbhPnpu8XJ\n8FlNQ1syooxNJvJd7BOdPsv/AHFjp0OHu8mblWQu+z0tlpQD+EEzG3gHzlEN3U+J\nmRDP5LGGvCMTcnd8elAS2M/KvNeEcDEzCcSjSTpgn93KkD8HP6ZQPdJL4Ts/Fkys\nj81aYBwU/sEG0OZi4vh06GQzujkFfmeWfvmOWs1xF69Uu6aKcLqP3Swd6QVAIOkh\nTHA7q9IPnlT+PSbrgEUtTFLw2u/eAJf0S5ZqbwQnbMrBs7j1k3GspFhYhggnEytB\nxtosGXbbAgMBAAECggEAK96igEgr0EIo8PWrbFScTAtG/UGwPRDeid6ZBhOMp/uA\nnrxqV0UtMxbLPmFLUtjKUMnxwE7DijoFjWxMDCLJ17L5dPp4EKgOzTws2cT9z0Mr\nhaQDEThwuYyaALCTJ7QGB6wysZNY24psggccs7PoCeFQlrZMoZYOS8c4IxNzR96p\nHsYdbll6uV5yydVTUn7ZDBD/JXJWZVwGxfsNP708chnalav7FybrRiecrBVRIo+f\nMurRyQDwI2y//ZHTNSaCC/sv0PKfFvjowUSfWOh9+fx0zonlcgRqSW9obgvWhkkM\nd97B4Ek/jAIRCz5VoF/60gv/nWKJ9QKOZKXG7lUrAQKBgQDkey+JPSc2NZqT55nN\naYW5SMnEyOk329LNE6CH61GQBFiksR8/2WRl7Ff257s6Mec+M4GyrKvvPdH2YT2F\ns0XqEoPyPycrv4gpcpx4rk0hkzLNDkJ9YFB7XllNCsQ6pofmXpMOmfxF0Gg/MhT6\nCs8+hHELcZhzGM1KDFXVYYFu4QKBgQDKF+ens5/5txx6IIDtu3/Lk7j+9DOhnjKq\nSQ3MS33fpzFPSQ/AT8YZCWKT6Rjt3m9eR8h1ptvh66Eli5YDb0McQQGrQNBeEejc\njkmvg3q3Yl0ILavWxUt4pHV3Y5xywereqs3lCwzLvv90Bx4//20aIoB9xGVm8CK/\n4WlhfT8JOwKBgEaFTxLI8UVmHiPwpCQmocOil8RJTtKS4umxWScalr4g2Utb8A1B\nCB/9ZtkqhTtdE8a7FxkS+q6JIjktolOWFco9lMQ8gdaa82f3nBwTkHMAf/mSoSsZ\ngz3QzTdeT1ra869DGZi0Jo1V2hdHWfojQ/xD3LBvi2JbEWH9lLCbu9uBAoGBAKqZ\nm3k6bWXEakm+fpgxnCQixByV0bAxd9vAZ+F6KPxQi5O+vYk+zp/8CDeMovrKt4ED\nX/nRrfT9kL+9IhosJp8HUX1b7Yo73DOz+ggsGcANTTPGOjXHv3pMes0aTcuiX78w\nuTcNKPQmfEdaavLjkRpq3cVNsbxAI1WP2AHwVPJZAoGAVADnNO3h4KzKLB6haOr1\nKqZ9ffeBRZ4Drbd2Z7/YdkQCp2mIiIgPGzMIj+l2jlNvMayL66VkhQZVM1S1R9HP\nS41Hn2Y94NI/Q/cRNrkKWI8Weh8LOek7tudF5PI5RbzZ+PwqfjFzFvr3KXLNPmmy\nBO22jSkex2LLU1PZ6lyRmwI=\n-----END PRIVATE KEY-----\n", client_email: "firebase-adminsdk-ycap5@video-app-4f774.iam.gserviceaccount.com", client_id: "106816006818868366380", auth_uri: "https://accounts.google.com/o/oauth2/auth", token_uri: "https://oauth2.googleapis.com/token", auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs", client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ycap5%40video-app-4f774.iam.gserviceaccount.com",}

// Provide the required configuration
const CREDENTIALS = text;
const calendarId = process.env.CALENDAR_ID;
// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '+05:30';

// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

let dateTime = dateTimeForCalander();

console.log(dateTime);

// Event for Google Calendar
let event = {
    'summary': `This is the summary.`,
    'description': `This is the description.`,
    'start': {
        'dateTime': dateTime['start'],
        'timeZone': 'Asia/Kolkata'
    },
    'end': {
        'dateTime': dateTime['end'],
        'timeZone': 'Asia/Kolkata'
    }
};

insertEvent(event)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

// Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Asia/Kolkata'
        });
    
        let items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

let start = '2020-10-03T00:00:00.000Z';
let end = '2020-10-04T00:00:00.000Z';

// getEvents(start, end)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Delete an event from eventID
const deleteEvent = async (eventId) => {

    try {
        let response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId
        });

        if (response.data === '') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
    }
};

let eventId = 'hkkdmeseuhhpagc862rfg6nvq4';

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });