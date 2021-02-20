import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Block} from 'galio-framework';
import {Input, Button} from '../components';
import {Theme} from '../constants';
import {joinMeetingRoom} from '../axios/user';

const JoinMeeting = (props) => {
  const [meetingId, setMeetingId] = useState(null);
  const {navigation} = props;

  const handleChange = (value) => {
    setMeetingId(value);
  };

  const handleSubmit = async() => {
    let api = await joinMeetingRoom({meetingId:meetingId});
    console.log(api);
    alert(api.message);
    // navigation.navigate('MeetingRoom')
  }
  
    return (
      <Block safe flex style={styles.container}>
        <Block style={styles.children}>
          <Text>Meeting ID</Text>
          <Input
            placeholder="Meeting ID"
            onChangeText={(e) => handleChange(e)}
          />
        </Block>
        <Block style={styles.proceedChild}>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text style={styles.proceed}>Proceed</Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
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
