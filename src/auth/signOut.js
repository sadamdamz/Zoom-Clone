import auth from '@react-native-firebase/auth';

const signOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

export default signOut;
