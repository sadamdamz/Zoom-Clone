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
    console.log(user);
    return (
      <MainStack.Navigator>
        <MainStack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
          user={user}
          {...this.props}
        />
      </MainStack.Navigator>
    );
  }
}

export default Main;
