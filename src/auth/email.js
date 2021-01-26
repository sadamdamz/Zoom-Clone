import auth from '@react-native-firebase/auth';

export const CreateEmailAuth = (email, password) => {
  console.log(email, password);
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
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
