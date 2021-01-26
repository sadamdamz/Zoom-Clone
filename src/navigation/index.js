/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState, useEffect} from 'react';
import Screens from './Screens';
import {View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';

const index = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  // if (!user) {
  //   return <Screens />;
  // }

  return (
    <Screens user={user} />
    // <View>
    //   <Text>Welcome {user.email}</Text>
    // </View>
  );
};

export default index;
