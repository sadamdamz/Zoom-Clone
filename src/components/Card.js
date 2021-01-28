import React from 'react';
import {Text, StyleSheet, SafeAreaView, ScrollView, Image} from 'react-native';
import {Block} from 'galio-framework';
import {Icon} from '../components';
import UserAvatar from 'react-native-user-avatar';
import { Theme } from '../constants';

const MeetingListCard = (props) => {
  const {img, subject, date, time, members} = props;
  return (
    <Block style={styles.container}>
      <Block style={styles.child1}>
      <UserAvatar
        isPicture={true}
        src={img}
        shape="rounded"
      />
      </Block>
      <Block style={styles.child2}>
        <Text style={styles.subject}>{subject}</Text>
        <Text style={styles.txt}>Date - {date}</Text>
        <Text style={styles.txt}>Time - {time}</Text>
        <Text style={styles.txt}>Members - {members}</Text>
      </Block>
      <Block>
        {/* <Icon name="options-vertical" family="SimpleLineIcons" /> */}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Theme.COLORS.Disable,
    borderBottomWidth: 2
  },
  child1: {
    paddingLeft: 10,
    paddingRight: 10
  },
  child2: {
    paddingTop: 20,
    paddingBottom: 20
  },
  subject: {
    color: Theme.COLORS.BLUE,
    fontWeight: '700'
  },
  txt: {
    color: Theme.COLORS.Disable,
  }
});


export default{
  MeetingListCard,
}