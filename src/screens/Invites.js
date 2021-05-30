import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Block} from 'galio-framework';
import {Theme, Constant} from '../constants/index';
import {Button} from '../components';
import {users} from '../axios';
import {getUserName} from '../helper/userData';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

const windowHeight = Dimensions.get('window').height;

const invites = (props) => {
  const [meetingId, setMeetingId] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const [fields, setFields] = useState({
    duration: '1',
    topic: 'Conference Call',
    timeZone: '+05:50'
  });
  const [timeZoneValues, setTimeZone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datePicker, setDatePicker] = useState(false);
  const [timePicker, setTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);
  const [country, setCountry] = useState();
  const nowUTC = moment.utc();
  const {navigation, user} = props;

  useEffect(() => {
    getId();
  }, []);

  const getId = async () => {
    let postData = {
      uid: user._user.uid,
    };
    let api = await users.getMeetingId(postData);
    let timeZones = await users.getTimeZones();
    setMeetingId(api.meetingId);
    setSpinner(false);
    console.log(timeZones);
  };

  const addToCalendar = () => {
    const eventConfig = {
      title: fields.topic,
      startDate: date,
      endDate: time,
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

  const hideDatePicker = (date) => {
    setDatePicker(false);
    setDate(date);
  };

  const hideTimePicker = (date) => {
    setTimePicker(false);
    setTime(date);
  };

  const handleDate = (date) => {
    setDate(date);
    hideDatePicker(date);
  };

  const handleTime = (date) => {
    setTime(date);
    hideTimePicker(date);
  };

  const handleSubmit = () => {
    if (value.trim().length == 0) {
      return;
    } else {
      setValue('');
      setItems([...items, value]);
    }
  };

  const removeList = (key) => {
    let item = items.filter((value, index) => {
      return key !== value;
    });
    setItems(item);
  };

  const handleScheduleMeet = async () => {
    console.log(meetingId);
    setSpinner(true);
    let field = fields;
    let gmt = Constant.TimeZones.filter(item => {
      return item.value === fields.timeZone;
    })
    field['momentDate'] = date;
    field['date'] = moment(date).format('MMMM Do YYYY');
    field['time'] = moment(time).format('LT');
    field['userName'] = getUserName(user);
    field['mailTo'] = items;
    field['uid'] = user._user.uid;
    field['gmt'] = gmt
    console.log(field);
    let api = await users.scheduleMeeting(field);
    navigation.navigate('MeetingList');
    setSpinner(false);
  };

  const handleStartMeeting = async () => {
    setSpinner(true);
    let postData = {
      meetingId: meetingId,
      host: true,
      user: user._user,
    };
    let api = await users.hostMeetingController(postData);
    navigation.navigate('MeetingRoom', {
      meetingId: meetingId,
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
      <DateTimePickerModal
        isVisible={datePicker}
        mode="date"
        onConfirm={handleDate}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={timePicker}
        mode="time"
        onConfirm={handleTime}
        onCancel={hideTimePicker}
      />
      <ScrollView>
      <Block style={styles.parent}>
        <Block style={styles.children1}>
          <Block>
            <Text style={styles.headTxt}>SCHEDULE MEETING</Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Topic</Text>
            <TextInput
              placeholder="topic"
              style={styles.input}
              value={fields.topic}
              onChangeText={(e) => setFields({...fields, topic: e})}
            />
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Date</Text>
            <Text style={styles.input} onPress={() => setDatePicker(true)}>
              {moment(date).format('MMMM Do YYYY')}
            </Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Time</Text>
            <Text style={styles.input} onPress={() => setTimePicker(true)}>
              {moment(time).format('LT')}
            </Text>
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Duration</Text>
            <DropDownPicker
              items={Constant.Duration}
              defaultValue={fields.duration}
              containerStyle={{height: 40}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={(item) =>
                setFields({...fields, duration: item.value})
              }
              style={styles.input}
            />
          </Block>
          <Block style={styles.child}>
            <Text style={styles.txt}>Time Zone</Text>
            <DropDownPicker
              items={Constant.TimeZones}
              defaultValue={fields.timeZone}
              containerStyle={{height: 70}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{backgroundColor: '#fafafa', height:200, zIndex:2}}
              onChangeItem={(item) =>
                setFields({...fields, timeZone: item.value})
              }
              style={styles.input}
            />
          </Block>
          <Block style={{...styles.addParticipants,...styles.child}}>
            <Block>
            <TextInput
              placeholder="Add Participants"
              onChangeText={(e) => setValue(e)}
              onSubmitEditing={handleSubmit}
              style={{...styles.input, ...styles.addInput}}
              value={value}
            />
            </Block>
            <Block>
            <Block style={styles.addBtn} onPress={()=>handleSubmit()}><Text style={styles.addBtnTxt}>+</Text></Block>
            </Block>
          </Block>
          {items.length > 0 ? (
            <Block style={styles.selectedBox}>
              <ScrollView>
                <Block style={styles.list}>
                  {items.map((item, index) => (
                    <Block
                      style={styles.childList}
                      onPress={() => removeList(item)}
                      key={index}>
                      <Text
                        style={{fontSize: Theme.SIZES.SMFONT}}
                        onPress={() => removeList(item)}>
                        {item}
                      </Text>
                    </Block>
                  ))}
                </Block>
              </ScrollView>
            </Block>
          ) : null}
        </Block>
      </Block>
      </ScrollView>
      <Block style={styles.btnContainer}>
        <Button style={styles.sendBtn} onPress={() => handleStartMeeting()}>
          <Text style={styles.sendTxt}>Start Now</Text>
        </Button>
        <Button style={styles.sendBtn} onPress={() => handleScheduleMeet()}>
          <Text style={styles.sendTxt}>Shedule Meeting</Text>
        </Button>
      </Block>
    </SafeAreaView>
  );
};

export default invites;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.WHITE,
    height: '100%',
  },
  spinnerTextStyle: {
    color: Theme.COLORS.WHITE,
  },
  addBtn: {
    width:40,
    height:30,
    padding:0,
    backgroundColor: Theme.COLORS.BLUE,
    textAlign:'center',
    borderRadius:3,
    alignItems:'center',
    marginLeft: 10
  },
  addBtnTxt: {
    flex:1,
    color: Theme.COLORS.WHITE,
    textAlign:'center',
    alignItems:'center'
  },
  addInput: {
    width: 300,
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
  input: {
    width: 200,
    borderWidth: 1,
    height: 40,
    padding: 7,
    borderColor: Theme.COLORS.GRAYBACKGROUND,
    borderRadius: 5,
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
  selectedBox: {
    borderWidth: 0.6,
    borderColor: Theme.COLORS.BLUE,
    // borderRadius: 10,
    width: 300,
    height: 130,
  },
  list: {
    // flex:1,
    backgroundColor: Theme.COLORS.WHITE,
  },
  childList: {
    // flex:1,
    // flexDirection:'column',
    margin: 5,
    padding: 5,
    backgroundColor: Theme.COLORS.GRAYBACKGROUND,
    borderRadius: 3,
    width: '50%',
    fontSize: 2,
  },
  addParticipants: {
    // flex:1,
    flexDirection:'column',
    marginBottom: 10,
  },
});
