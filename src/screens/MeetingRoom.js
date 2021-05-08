import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  BackHandler,
  Alert,
  View,
  DeviceEventEmitter,
} from 'react-native';
import {Theme} from '../constants';
import {Block} from 'galio-framework';
import {Button} from '../components/index';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import {connect} from 'react-redux';
import {
  joinRoom,
  muteAudio,
  muteVideo,
  endMeeting,
} from '../store/action/videoAction';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {users} from '../axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import UserAvatar from 'react-native-user-avatar';
import {getDefaultName} from '../helper/userData';
import InCallManager from 'react-native-incall-manager';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class MeetingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: true,
      video: true,
      speaker: false,
      meetingData: {},
      orientation: ''
    };
  }

  getOrientation = () =>
  {
  console.log('getorientation', this.state.orientation);
        if( Dimensions.get('window').width < Dimensions.get('window').height )
        {
          this.setState({ orientation: 'portrait' });
        }
        else
        {
          this.setState({ orientation: 'landscape' });
        }
  }

  componentDidMount() {
    const {meetingId, user} = this.props.route.params;
    const {mute, video} = this.state;
    this.getOrientation();
    this.getMedia(meetingId, user, mute, video);
    Dimensions.addEventListener( 'change', () =>
    {
      this.getOrientation();
    });
    DeviceEventEmitter.addListener('Proximity', function (data) {
      console.log('proximity', data);
      // --- do something with events
    });
    DeviceEventEmitter.addListener('WiredHeadset', function (data) {
      console.log('headphones', data);
      // --- do something with events
    });
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    InCallManager.stopRingtone();
    InCallManager.stop();
  }

  switchCam = () => {
    //switch camera
    this.state.stream._tracks[1]._switchCamera();
    console.log(this.state.stream);
    this.setState({stream: this.state.stream});
  };

  backAction = () => {
    Alert.alert('Are you sure', 'you want to End the Meeting ?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.endMeeting()},
    ]);
    return true;
  };

  getMedia = async (meetingId, user) => {
    let api = await users.getMeetingDetailById(meetingId);
    this.setState({meetingData: api.data});
    console.log(api.data);
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then((stream) => {
          this.setStream(stream);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  setStream = (stream) => {
    this.setState({stream});
    // InCallManager.start({media: 'audio', ringback: '_BUNDLE_'});
    InCallManager.start({media: 'audio'});
    InCallManager.setSpeakerphoneOn(false);
    InCallManager.setKeepScreenOn(true);
    this.joinRoom();
  };

  handleSpeaker = () => {
    const {speaker} = this.state;
    this.setState({speaker: !speaker}, () => {
      InCallManager.setSpeakerphoneOn(this.state.speaker);
      console.log('InCallManager', InCallManager);
    });
  };

  joinRoom = () => {
    const {meetingId, user} = this.props.route.params;
    const {stream} = this.state;
    this.props.joinRoom(stream, meetingId, user);
  };

  muteAudio = () => {
    const {meetingId, user} = this.props.route.params;
    const {mute} = this.state;
    this.state.stream._tracks[0].enabled = !mute;
    this.setState({mute: !mute, stream: this.state.stream});
    this.props.muteAudio(this.state.stream, user);
  };

  muteCamera = () => {
    const {meetingId, user} = this.props.route.params;
    const {video} = this.state;
    this.state.stream._tracks[1].enabled = !video;
    this.setState({video: !video, stream: this.state.stream});
    this.props.muteVideo(this.state.stream, user);
  };

  endMeeting = async () => {
    const {stream} = this.state;
    const {meetingId, user} = this.props.route.params;
    const {
      video: {myStream},
    } = this.props;
    let postData = {
      meetingId: meetingId,
      user: user,
    };
    this.props.endMeeting(meetingId, stream, user, myStream.id);
    let api = await users.endMeeting(postData);
    this.props.navigation.navigate('MeetingList');
  };

  render() {
    const {
      video: {myStream, streams, remoteStreams, users},
    } = this.props;
    const {mute, video, speaker, stream, orientation, meetingData} = this.state;
    return (
      <Block style={styles.parent}>
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={400}
          openDuration={250}
          customStyles={{}}>
          <Block style={styles.participantsContainer}>
            <Text style={styles.participantsTitle}>Participants</Text>
            <ScrollView>
              <Block>
                {users.length > 0 ? (
                  <>
                    {users[0].map((item, index) => (
                      <Block style={styles.participants} key={index}>
                        <UserAvatar
                          isPicture={false}
                          shape="rounded"
                          name={getDefaultName(item)}
                        />
                        <Text style={styles.participantsName}>
                          {getDefaultName(item)}
                        </Text>
                      </Block>
                    ))}
                  </>
                ) : null}
              </Block>
            </ScrollView>
          </Block>
        </RBSheet>
        <Block style={styles.child1}>
          <Feather
            name={speaker ? 'volume-2' : 'volume-x'}
            size={23}
            color="white"
            style={styles.iconStyle}
            onPress={this.handleSpeaker}
          />
          <Ionicons
            name="camera-reverse-sharp"
            size={23}
            color="white"
            style={styles.iconStyle}
            onPress={this.switchCam}
          />
          <Text style={styles.topic}>
            {meetingData['topic']
              ? `${meetingData['topic'].slice(0, 28)}...`
              : 'Conference Call...'}
          </Text>
          <Button style={styles.endBtn} onPress={this.backAction}>
            <Text style={styles.endText}>End</Text>
          </Button>
        </Block>
        <Block style={styles.child2}>
          {myStream ? (
            myStream.stream._tracks[1].enabled == true ? (
              <>
                <RTCView
                  streamURL={myStream.stream.toURL()}
                  style={[styles.mainRtc, {width:(orientation==='landscape')?responsiveScreenWidth(100):responsiveScreenWidth(100), height:(orientation==='landscape')?responsiveScreenHeight(40):responsiveScreenHeight(40),}]}
                />
              </>
            ) : null
          ) : null}
        </Block>
        <Block style={styles.child3}>
          <ScrollView horizontal={true}>
            {streams.length > 0 ? (
              <>
                {streams.map((item, index) => {
                  return (
                    <Block style={styles.scrollChilds} key={index}>
                      {item.stream._tracks[1].enabled == true ? (
                        <RTCView
                          streamURL={item.stream.toURL()}
                          style={[styles.childRtc, , {width:(orientation==='landscape')?responsiveScreenWidth(100):responsiveScreenWidth(100), height:(orientation==='landscape')?responsiveScreenHeight(20):responsiveScreenHeight(20),}]}
                        />
                      ) : null}
                    </Block>
                  );
                })}
              </>
            ) : null}
            {remoteStreams.length > 0 ? (
              <>
                {remoteStreams.map((item, index) => {
                  return (
                    <Block style={styles.scrollChilds} key={index}>
                      {item.stream._tracks[1].enabled == true ? (
                        <RTCView
                          streamURL={item.stream.toURL()}
                          style={styles.childRtc}
                        />
                      ) : null}
                    </Block>
                  );
                })}
              </>
            ) : null}
          </ScrollView>
        </Block>
        <Block style={styles.child4}>
          <Block>
            <FontAwesome
              name={mute ? 'microphone' : 'microphone-slash'}
              size={23}
              color={mute ? 'white' : 'red'}
              style={styles.iconStyle}
              onPress={this.muteAudio}
            />
            <Text style={styles.iconTxt} onPress={this.muteAudio}>
              {mute ? 'Mute' : 'UnMute'}
            </Text>
          </Block>
          <Block>
            <FontAwesome5
              name={video ? 'video' : 'video-slash'}
              size={23}
              color={video ? 'white' : 'red'}
              style={styles.iconStyle}
              onPress={this.muteCamera}
            />
            <Text style={styles.iconTxt} onPress={this.muteCamera}>
              {video ? 'Camera' : 'Turn On'}
            </Text>
          </Block>
          <Block>
            <Ionicons
              name="people"
              size={23}
              color="white"
              style={styles.iconStyle}
              onPress={() => this.RBSheet.open()}
            />
            <Text style={styles.iconTxt} onPress={() => this.RBSheet.open()}>
              Participants
            </Text>
          </Block>
          <Block>
            <Entypo
              name="chat"
              size={23}
              color="white"
              style={styles.iconStyle}
            />
            <Text style={styles.iconTxt}>Chat</Text>
          </Block>
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = ({video}) => ({video});

const styles = StyleSheet.create({
  topic: {
    color: 'white',
  },
  participantsContainer: {},
  participantsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  participants: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 20,
    alignItems: 'center',
  },
  participantsImg: {},
  participantsName: {
    fontSize: 17,
    marginLeft: 10,
    marginRight: 20,
  },
  parent: {
    flex: 1,
    height: windowHeight * 0.5,
    backgroundColor: 'black',
  },
  child1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  child2: {
    flex: 5,
    justifyContent: 'center',
  },
  child3: {
    flex: 2,
    alignItems: 'center',
  },
  child4: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconStyle: {
    textAlign: 'center',
  },
  iconTxt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 10,
  },
  endBtn: {
    backgroundColor: 'red',
    width: 70,
    height: 25,
  },
  endText: {
    color: Theme.COLORS.WHITE,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  scrollChilds: {
    height: '100%',
    width: 200,
    borderColor: 'white',
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
  },
  mainRtc: {
    width: responsiveScreenWidth(100),
    height: responsiveScreenHeight(40),
  },
  childRtc: {
    width: responsiveScreenWidth(100),
    height: responsiveScreenHeight(20),
  },
});

export default connect(mapStateToProps, {
  joinRoom,
  muteAudio,
  muteVideo,
  endMeeting,
})(MeetingRoom);
