import React, {Component} from 'react';
import MeetingList from '../screens/MeetingList';
import Invite from '../screens/Invite';
import JoinMeeting from '../screens/JoinMeeting';
import MeetingRoom from '../screens/MeetingRoom';
import {createStackNavigator} from '@react-navigation/stack';

const MainStack = createStackNavigator();

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {user} = this.props;
    console.log(user);
    return (
      <MainStack.Navigator>
        <MainStack.Screen name="MeetingList" options={{headerShown: false}}>
          {(props) => <MeetingList {...props} user={user} />}
        </MainStack.Screen>
        <MainStack.Screen name="Invite" options={{title:''}}>
          {(props) => <Invite {...props} user={user} />}
        </MainStack.Screen>
        <MainStack.Screen name="JoinMeeting">
          {(props) => <JoinMeeting {...props} user={user} />}
        </MainStack.Screen>
        <MainStack.Screen name="MeetingRoom" options={{title:''}}>
          {(props) => <MeetingRoom {...props} user={user} />}
        </MainStack.Screen>
      </MainStack.Navigator>
    );
  }
}

export default Main;
