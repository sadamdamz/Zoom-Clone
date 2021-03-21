import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Block} from 'galio-framework';
import {Theme, Images} from '../constants/index';
import {Input, Button} from '../components';
import {users} from '../axios';
import {getUserName} from '../helper/userData';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';

const inviteDetail = (props) => {
  return (
    <SafeAreaView safe={true} style={styles.container}>
      <Block style={styles.parent}>
        <Block style={styles.children1}>
          {/* <Block>
            <Text style={styles.headTxt}>MEETING</Text>
          </Block> */}
          <Block style={styles.child}>
            <Text style={styles.txt}>Topic</Text>
            <Text style={styles.detailTxt}>Video Call Meeting</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Date</Text>
            <Text style={styles.detailTxt}>15/03/2021</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Time</Text>
            <Text style={styles.detailTxt}>1:30 pm</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Time Zone</Text>
            <Text style={styles.detailTxt}>(GMT+5:30) India</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Duration</Text>
            <Text style={styles.detailTxt}>30 min</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Passcode</Text>
            <Text style={styles.detailTxt}>xksji</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>MeetingId</Text>
            <Text style={styles.detailTxt}>7689045</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Invite Link</Text>
            <Text style={styles.detailTxt}>https://zoom.clone.com?7689045</Text>
          </Block>
        </Block>
      </Block>
      <Block style={styles.btnContainer}>
        <Button style={styles.sendBtn}>
          <Text style={styles.sendTxt}>Start Meeting</Text>
        </Button>
      </Block>
    </SafeAreaView>
  );
};

export default inviteDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.WHITE,
    height: '100%',
  },
  sendBtn: {
    backgroundColor: Theme.COLORS.BLUE,
    // borderRadius: Theme.SIZES.BTNRADIUS,
  },
  sendTxt: {
    color: Theme.COLORS.WHITE,
    fontWeight: '700',
  },
  parent: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  children1: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'center',
  },
  child: {
    // flex:1,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  txt: {
    width: 100,
    fontWeight: '700',
  },
  detailTxt: {
    width: 200,
    // borderWidth: 1,
    height: 30,
    padding: 7,
  },
  headTxt: {
    fontWeight: '700',
    fontSize: 17,
    padding: 10,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
