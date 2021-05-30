import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  ToastAndroid,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Block} from 'galio-framework';
import {Theme, Images, Constant} from '../constants/index';
import {Input, Button} from '../components';
import {users} from '../axios';
import Spinner from 'react-native-loading-spinner-overlay';
import {getUserName} from '../helper/userData';

const windowHeight = Dimensions.get('window').height;

const inviteDetail = (props) => {
  const [params, setParams] = useState(props.route.params);
  const [spinner, setSpinner] = useState(true);
  const [duration, setDuration] = useState('');
  const [data, setData] = useState({});

  const {navigation, user} = props;

  useEffect(() => {
    getInviteData();
  }, []);

  const getInviteData = async () => {
    let postData = {
      ...params,
    };
    let api = await users.getInviteDetails(postData);
    let timeDuration = Constant.Duration.filter((item, index) => {
      return item.value == api.data.duration;
    });
    setDuration(timeDuration[0].label);
    setData(api.data);
    setSpinner(false);
    console.log(api);
  };

  const copyToClipboard = () => {
    Clipboard.setString(`${getUserName(user)} is inviting you to Zoom Meeting \n\n Topic: ${data['topic']} \n\n Scheduled Date: ${data['date']} \n\n Scheduled Time: ${data['time']} \n\n Time Zone: ${data.gmt[0].label} \n\n MeetingId: ${data['meetingId']} \n\n Link: https://wedgrab.com/meetingroom/${data['meetingId']} \n\n `,);
    ToastAndroid.show("Link Copied", ToastAndroid.SHORT);
  };

  const handleStartMeeting = async () => {
    setSpinner(true);
    let postData = {
      meetingId: data.meetingId,
      host: true,
      user: user._user,
    };
    let api = await users.hostMeetingController(postData);
    navigation.navigate('MeetingRoom', {
      meetingId: data.meetingId,
      user: user._user,
    });
    setSpinner(false);
  };

  return (
    <SafeAreaView safe={true} style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      {spinner ? null : (
        <>
        <ScrollView>
          <Block style={styles.parent}>
            <Block style={styles.children1}>
              <Block style={styles.child}>
                <Text style={styles.txt}>Topic</Text>
                <Text style={styles.detailTxt}>{data['topic']}</Text>
              </Block>
              <Block style={styles.child}>
                <Text style={styles.txt}>Date</Text>
                <Text style={styles.detailTxt}>{data['date']}</Text>
              </Block>
              <Block style={styles.child}>
                <Text style={styles.txt}>Time</Text>
                <Text style={styles.detailTxt}>{data['time']}</Text>
              </Block>
              <Block style={styles.child}>
                <Text style={styles.txt}>Duration</Text>
                <Text style={styles.detailTxt}>{duration}</Text>
              </Block>
              <Block style={styles.child}>
                <Text style={styles.txt}>Time Zone</Text>
                <Text style={styles.detailTxt}>{data.gmt[0].label}</Text>
              </Block>
              <Block style={styles.child}>
                <Text style={styles.txt}>MeetingId</Text>
                <Text style={styles.detailTxt}>{data['meetingId']}</Text>
              </Block>
              <Block style={styles.child}>
                <Text style={styles.txt}>Invite Link</Text>
                <Text style={{...styles.detailTxt, ...styles.linkTxt}}>{`https://wedgrab.com/meetingroom/${data['meetingId']}`}</Text>
              </Block>
            </Block>
          </Block>
          </ScrollView>
          {
            params.show?(
              <Block style={styles.btnContainer}>
              <Button style={styles.sendBtn} onPress={()=>copyToClipboard()}>
                <Text style={styles.sendTxt}>Copy Invitation</Text>
              </Button>
              <Button
                style={styles.sendBtn}
                onPress={handleStartMeeting}>
                <Text style={styles.sendTxt}>Start Meeting</Text>
              </Button>
            </Block>
            ):null
          }
        </>
      )}
    </SafeAreaView>
  );
};

export default inviteDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.WHITE,
    height: '100%',
  },
  spinnerTextStyle: {
    color: Theme.COLORS.WHITE,
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
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height:windowHeight-200,
    paddingTop: 20,
  },
  children1: {
    flex: 7,
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
    height: 60,
  },
  txt: {
    width: 100,
    fontWeight: '700',
    height: 80
  },
  detailTxt: {
    width: 200,
    // borderWidth: 1,
    height: 80,
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
