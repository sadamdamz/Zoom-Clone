import auth from '@react-native-firebase/auth';

export const CreateEmailAuth = (email, password) => {
  // let data = 'Account Created SuccessFully';
  let data = '';
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        data = 'That email address is already in use!';
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        data = 'Email Adress is Invalid';
        console.log('That email address is invalid!');
      }
    })
    .then(() => {
      return data;
    });
};

export const SigninEmailAuth = (email, password) => {
  console.log(email, password);
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('signed in!');
    })
    .catch((error) => {
      return error;
      // if (error.code === 'auth/email-already-in-use') {
      //   alert('Email');
      //   return error;
      //   // console.log('That email address is already in use!');
      // }

      // if (error.code === 'auth/invalid-email') {
      //   alert('Email');
      //   return 'Email Address is Invalid';
      //   // console.log('That email address is invalid!');
      // }
    });
};
