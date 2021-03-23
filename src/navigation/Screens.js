import React, {Component} from 'react';
import Auth from './Auth';
import Main from './Main';
import MeetingList from '../screens/MeetingList';
import Invite from '../screens/Invites';
import JoinMeeting from '../screens/JoinMeeting';
import MeetingRoom from '../screens/MeetingRoom';
import Profile from '../screens/Profile';
import InviteDetail from '../screens/inviteDetail';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import linking from './linking';

const Stack = createStackNavigator();

class Screens extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {user} = this.props;
    console.log(user);
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          {user ? (
            <>
            {/* <Stack.Screen name="Main" options={{headerShown: false}}>
              {(props) => <Main {...props} user={user} />}
            </Stack.Screen> */}
            {/* <Stack.Screen name="JoinMeeting" >{(props) => <JoinMeeting {...props} user={user} />}</Stack.Screen> */}
            <Stack.Screen name="MeetingList" options={{headerShown: false}}>
          {(props) => <MeetingList {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="Invite" options={{title:''}}>
          {(props) => <Invite {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="InviteDetail" options={{title:'Meeting Detail'}}>
          {(props) => <InviteDetail {...props} user={user}/>}
        </Stack.Screen>
        <Stack.Screen name="JoinMeeting">
          {(props) => <JoinMeeting {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="Profile" options={{title:'Profile'}}>
          {(props) => <Profile {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="MeetingRoom" options={{headerShown: false}}>
          {(props) => <MeetingRoom {...props} user={user} />}
        </Stack.Screen>
            </>
          ) : (
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{headerShown: false}}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Screens;
