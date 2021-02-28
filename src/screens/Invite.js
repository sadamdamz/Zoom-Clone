import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ToastAndroid
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Block} from 'galio-framework';
import {Theme, Images} from '../constants/index';
import {Input, Button} from '../components';
import {users} from '../axios';
import {getUserName} from '../helper/userData';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';

const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.warn(s);
  return s;
};

const Invite = (props) => {
  const [meetingId, setMeetingId] = useState(null);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const {navigation, user} = props;

  const eventTitle = 'Lunch';
  const nowUTC = moment.utc();

  const addToCalendar = (title, startDateUTC) => {
    const eventConfig = {
      title:'Video Call Meeting',
      startDate: utcDateToString(date),
      endDate: utcDateToString(moment.utc(date).add(1, 'hours')),
      notes: 'tasty!',
      navigationBarIOS: {
        tintColor: 'orange',
        backgroundColor: 'green',
        titleColor: 'blue',
      },
  };
  AddCalendarEvent.presentEventCreatingDialog(eventConfig)
  .then((eventInfo) => {
    // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
    // These are two different identifiers on iOS.
    // On Android, where they are both equal and represent the event id, also strings.
    // when { action: 'CANCELED' } is returned, the dialog was dismissed
    console.warn(JSON.stringify(eventInfo));
  })
  .catch((error) => {
    // handle error such as when user rejected permissions
    console.warn(error);
  });
    };

  useEffect(()=>{
    getId()
  },[])

  const getId = async () => {
    let postData = {
      uid: user._user.uid,
    };
    let api = await users.getMeetingId(postData);
    setMeetingId(api.meetingId);
    console.log(api);
  };

  const copyToClipboard = (data) => {
    Clipboard.setString(data);
  };

  const handleStartMeeting = async () => {
    let postData = {
      meetingId: meetingId,
      host: true,
      user: user._user,
    };
    let api = await users.hostMeetingController(postData);
    console.log(api);
    navigation.navigate('MeetingRoom', {
      meetingId: meetingId,
      user: user._user,
    });
  };

  const sendInvitation = async (date) => {
    setLoading(true);
    let postData = {
      meetingId: meetingId,
      userName: getUserName(user),
      mailTo: items,
      date: date,
    }
    console.log(postData);
    let api = await users.sendInvitationEmail(postData);
    if(api.status==200){
      ToastAndroid.show("Invitation Email Sent", ToastAndroid.SHORT);
    }else{
      ToastAndroid.show("Invalid Email", ToastAndroid.SHORT);
    }
    setLoading(false);
  }

  const handleSubmit = () => {
    if (value.trim().length == 0) {
      return;
    } else {
      setValue('');
      setItems([...items, value]);
    }
    console.log(items);
  };

  const removeList = (key) => {
    console.log(key, 'remove');
    let item = items.filter((value,index)=>{
      return key!==value 
    })
    setItems(item);
  }

  const hideDatePicker = (date) => {
    setDatePickerVisibility(false);
    sendInvitation(date)
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    console.log(date);
    setDate(date);
    hideDatePicker(date);
  };

  const openDatePicker = () =>{
    setDatePickerVisibility(true);
  }

  return (
    <SafeAreaView safe={true} style={styles.container}>
      <ScrollView>
        <Block>
        <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
        </Block>
        <Block>
          <Text style={styles.inviteTxt}>INVITE PARTICIPANTS</Text>
          <Text style={styles.content}>
            Share the below linkor meeting ID to let participants join your
            meeting
          </Text>
        </Block>
        <Block row={true} style={styles.child2}>
          <Text style={styles.meetingLink}>
            {`https://zoom.clone.com?${meetingId}`}
          </Text>
          <TouchableOpacity
            onPress={() =>
              copyToClipboard(`https://zoom.clone.com?${meetingId}`)
            }>
            <Image style={styles.copyIcon} source={Images.Copy} />
          </TouchableOpacity>
        </Block>
        <Block row={true} style={styles.child2}>
          <Text style={styles.meetingId}>{meetingId}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(`${meetingId}`)}>
            <Image style={styles.copyIcon} source={Images.Copy} />
          </TouchableOpacity>
        </Block>
        <Block style={styles.child3}>
          <TextInput
            placeholder="Add Participants"
            onChangeText={(e) => setValue(e)}
            onSubmitEditing={handleSubmit}
            style={styles.input}
            value={value}
          />
          <Block style={styles.selectedBox}>
            <ScrollView>
              <Block style={styles.list}>
                {items.map((item, index) => (
                  <Block style={styles.childList} onPress={()=>removeList(item)} key={index}>
                    <Text style={{fontSize:Theme.SIZES.SMFONT}} onPress={()=>removeList(item)}>{item}</Text>
                  </Block>
                ))}
              </Block>
            </ScrollView>
          </Block>
          {
            date?(<Block>
            <Text>Date:{date.toString()}</Text>
          </Block>):null
          }
        </Block>
        <Block style={styles.child4}>
          <Image style={styles.emailIcon} source={Images.Email} />
        </Block>
        <Block style={styles.child5}>
          <Button
            style={styles.sendBtn}
            onPress={openDatePicker}
            loading={loading}
          >
            <Text style={styles.sendTxt}>Send</Text>
          </Button>
        </Block>
        {
          date?(
            <Block style={styles.child5}>
            <Button style={styles.sendBtn} onPress={addToCalendar}>
              <Text style={styles.sendTxt}>Add to Calendar</Text>
            </Button>
          </Block>
          ):null
        }
        <Block style={styles.child5}>
          <Button style={styles.sendBtn} onPress={handleStartMeeting}>
            <Text style={styles.sendTxt}>Start Meeting</Text>
          </Button>
        </Block>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.WHITE,
    height: '100%',
  },
  list: {
    // flex:1,
    backgroundColor: Theme.COLORS.WHITE,
  },
  childList: {
    // flex:1,
    // flexDirection:'column',
    margin:5,
    padding:5,
    backgroundColor: Theme.COLORS.GRAYBACKGROUND,
    borderRadius: 3,
    width: '50%',
    fontSize: 2,
  },
  child2: {
    textAlign: 'center',
    paddingTop: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
  },
  child3: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 10,
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: Theme.COLORS.BLUE,
    // borderRadius: 10,
    width: '100%',
    height: 130,
  },
  child4: {
    paddingTop: 30,
  },
  child5: {
    paddingTop: 10,
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: Theme.COLORS.BLUE,
    borderRadius: Theme.SIZES.BTNRADIUS,
  },
  sendTxt: {
    color: Theme.COLORS.WHITE,
    fontWeight: '700',
  },
  emailIcon: {
    width: 100,
    height: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {
    width: '100%',
  },
  inviteTxt: {
    width: '100%',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: Theme.COLORS.GRAYBLACK,
  },
  content: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
    fontWeight: '300',
    marginLeft: 70,
    marginRight: 70,
    color: Theme.COLORS.GRAYBLACK,
  },
  meetingLink: {
    color: Theme.COLORS.BLUE,
  },
  copyIcon: {
    height: 40,
    width: 30,
    marginLeft: 10,
  },
});
