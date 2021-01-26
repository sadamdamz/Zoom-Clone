import React, {Component} from 'react';
import Auth from './Auth';
import Main from './Main';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

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
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <Stack.Screen name="Main" options={{headerShown: false}}>
              {(props) => <Main {...props} user={user} />}
            </Stack.Screen>
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
