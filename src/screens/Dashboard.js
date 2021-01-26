import React, {Component} from 'react';
import {View, Text} from 'react-native';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {user} = this.props;
    return (
      <View>
        <Text>Hii Welcome! {user.displayName}</Text>
      </View>
    );
  }
}

export default Dashboard;
