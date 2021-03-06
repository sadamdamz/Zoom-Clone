import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Block} from 'galio-framework';
import {Input, Button} from '../components';
import {Theme} from '../constants';
import {users} from '../axios';

const JoinMeeting = (props) => {
  
  const [meetingId, setMeetingId] = useState(null);
  const {navigation, user, route} = props;

  useEffect(()=>{
    if(route.params){
      setMeetingId(route.params.id);
    }
  },[])

  const handleChange = (value) => {
    setMeetingId(value);
  };

  const handleSubmit = async() => {
    let api = await users.joinMeetingRoom({meetingId:meetingId, user:user._user});
    console.log(api);
    if(api.status===200){
      navigation.navigate('MeetingRoom',{
        meetingId:meetingId,
        user: user._user
      })
    }else{
      alert(api.message);
    }
    // navigation.navigate('MeetingRoom')
  }
  
    return (
      <Block safe flex style={styles.container}>
        <Block style={styles.children}>
          <Text>Meeting ID</Text>
          <Input
            placeholder="Meeting ID"
            value={meetingId}
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
