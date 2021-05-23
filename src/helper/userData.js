const getUserName = (user) => {
  let name;
  if(user._user.phoneNumber==null && user._user.displayName==null){
    name=user._user.email;
  }else if(user._user.phoneNumber==null){
    name=user.displayName
  }else{
    name = user._user.phoneNumber
  }
  return name;
}

const getDefaultName = (user) => {
  let name;
  if(!user){
    return name
  }else{
    if(!user['phoneNumber'] && !user['displayName']){
      name=user.email;
    }else if(!user['phoneNumber']){
      name=user.displayName
    }else{
      name = user.phoneNumber
    }
  }
  return name;
}

const getUserAvartar = (user) => {
  let url = user?.photoURL;
  if(url){
    return url
  }else{
    return null
  }
}

export {
  getUserName,
  getDefaultName,
  getUserAvartar
}