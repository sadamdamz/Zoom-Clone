import React, {useState, useEffect} from 'react';
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
import {Theme, Images, Constant} from '../constants/index';
import {Input, Button} from '../components';
import {users} from '../axios';
import Spinner from 'react-native-loading-spinner-overlay';

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
    Clipboard.setString(`Topic: ${data.topic} MeetingId : ${data.meetingId} Date : ${data.date} Time : ${data.time}, duration : ${data.duration}  Url : ${data.url}`,);
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
                <Text style={styles.txt}>MeetingId</Text>
                <Text style={styles.detailTxt}>{data['meetingId']}</Text>
              </Block>
              <Block style={styles.child}>
                <Text style={styles.txt}>Invite Link</Text>
                <Text style={styles.detailTxt}>{data['url']}</Text>
              </Block>
            </Block>
          </Block>
          {
            params.show?(
              <Block style={styles.btnContainer}>
              <Button style={styles.sendBtn} onPress={()=>copyToClipboard()}>
                <Text style={styles.sendTxt}>Copy Invitation</Text>
              </Button>
              <Button
                style={styles.sendBtn}
                onPress={()=>navigation.navigate('MeetingRoom', {
                  meetingId: data['meetingId'],
                  user: user._user,
                })}>
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
    height: 50,
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
