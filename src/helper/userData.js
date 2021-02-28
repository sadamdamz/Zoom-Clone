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

export {
  getUserName
}