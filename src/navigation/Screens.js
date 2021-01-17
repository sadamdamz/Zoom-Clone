import React, { Component } from "react";
import Home from "../screens/Home";
import SignIn from "../screens/Signin";
import SignUp from "../screens/Signup";
import JoinMeeting from "../screens/JoinMeeting";
import MeetingRoom from "../screens/MeetingRoom";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

class Screens extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
          <Stack.Screen name="Signin" component={SignIn} options={{headerShown:false}} />
          <Stack.Screen name="Signup" component={SignUp} />
          <Stack.Screen name="Joinmeeting" component={JoinMeeting} />
          <Stack.Screen name="MeetingRoom" component={MeetingRoom} options={{headerShown:false}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Screens;
