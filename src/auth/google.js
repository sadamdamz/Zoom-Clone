import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

async function onGoogleButtonPress() {
  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  console.log(idToken);

  // Create a Google credential with the token
  const googleCredential = await auth.GoogleAuthProvider.credential(idToken);

  // console.log(googleCredential);
  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

export default onGoogleButtonPress;
