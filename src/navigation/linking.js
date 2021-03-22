const config ={
  screens: {
    Invite:'Invite',
    JoinMeeting:{
      path:'meetingroom/:id',
      params:{
        id: (id)=> `${id}`,
      }
    },

  }
}

const linking = {
  prefixes:['https://wedgrab.com'],
  config,
}

export default linking