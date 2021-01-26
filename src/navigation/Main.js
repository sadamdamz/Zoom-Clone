import React, {Component} from 'react';
import Dashboard from '../screens/Dashboard';
import MeetingList from '../screens/MeetingList';
import Invite from '../screens/Invite';
import {createStackNavigator} from '@react-navigation/stack';

const MainStack = createStackNavigator();

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {user} = this.props;
    return (
      <MainStack.Navigator>
        <MainStack.Screen name="Dashboard" options={{headerShown: false}}>
          {(props) => <Dashboard {...props} user={user} />}
        </MainStack.Screen>
        <MainStack.Screen name="MeetingList">
          {(props) => <MeetingList {...props} user={user} />}
        </MainStack.Screen>
        <MainStack.Screen name="Invite">
          {(props) => <Invite {...props} user={user} />}
        </MainStack.Screen>
      </MainStack.Navigator>
    );
  }
}

export default Main;
