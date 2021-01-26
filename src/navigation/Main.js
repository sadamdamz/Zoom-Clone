import React, {Component} from 'react';
import Dashboard from '../screens/Dashboard';
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
      </MainStack.Navigator>
    );
  }
}

export default Main;
