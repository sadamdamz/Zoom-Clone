import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Block} from 'galio-framework';
import {Input, Button} from '../components';
import {Theme} from '../constants';

class JoinMeeting extends Component {
  constructor(props) {
    super(props);
  }
  handleChange = (value, name) => {
    console.log(value, name);
  };

  render() {
    const {navigation} = this.props;
    return (
      <Block safe flex style={styles.container}>
        <Block style={styles.children}>
          <Text>Email</Text>
          <Input
            placeholder="Email"
            onChangeText={(e) => this.handleChange(e, 'email')}
          />
        </Block>
        <Block style={styles.children}>
          <Text>Meeting Key</Text>
          <Input
            placeholder="Meeting Key"
            onChangeText={(e) => this.handleChange(e, 'key')}
          />
        </Block>
        <Block style={styles.proceedChild}>
          <TouchableOpacity onPress={() => navigation.navigate('MeetingRoom')}>
            <Text style={styles.proceed}>Proceed</Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  }
}

export default JoinMeeting;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Theme.COLORS.WHITE,
  },
  children: {
    paddingTop: 20,
    width: '90%',
  },
  proceedChild: {
    width: '100%',
    paddingTop: 20,
  },
  proceed: {
    color: Theme.COLORS.BLUE,
    fontWeight: '700',
    textAlign: 'right',
    paddingRight: 40,
    fontSize: 14.5,
  },
});
