import React, {Component} from 'react';
import Home from '../screens/Home';
import SignIn from '../screens/Signin';
import SignUp from '../screens/Signup';
import JoinMeeting from '../screens/JoinMeeting';
import MeetingRoom from '../screens/MeetingRoom';
import PhoneVerify from '../screens/PhoneVerify';
import Otp from '../screens/Otp';
import {createStackNavigator} from '@react-navigation/stack';

const AuthStack = createStackNavigator();

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <AuthStack.Screen name="Phone Verification" component={PhoneVerify} />
        <AuthStack.Screen name="Otp" component={Otp} />
        <AuthStack.Screen
          name="Signin"
          component={SignIn}
          options={{headerShown: false}}
        />
        <AuthStack.Screen name="Signup" component={SignUp} />
        <AuthStack.Screen name="Joinmeeting" component={JoinMeeting} />
        <AuthStack.Screen
          name="MeetingRoom"
          component={MeetingRoom}
          options={{headerShown: false}}
        />
      </AuthStack.Navigator>
    );
  }
}

export default Auth;
