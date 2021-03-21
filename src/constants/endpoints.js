const endPoints = {
    API_URL: "http://wedgrab.com",
    API_ENDPOINT: "wedgrab.com",
}

const Duration = [
    {
        label: '1:00 hrs',
        value: '1',
        min:'60'
      },
      {
        label: '1:30 hrs',
        value: '2',
        min:'90'
      },
      {
        label: '2:00 hrs',
        value: '3',
        min: '120'
      },
      {
        label: '2:30 hrs',
        value: '4',
        min: '180'
      },
      {
        label: '3:00 hrs',
        value: '5',
        min: '240'
      },
]

export default {
    endPoints,
    Duration,
}

// export const API_URL = `http://139.59.34.203:5000`; //live ip
// export const API_URL = `http://192.168.43.20:5000`; //local ip
