import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  BackHandler, 
  Alert
} from 'react-native';
import {Theme} from '../constants';
import {Block} from 'galio-framework';
import {Button} from '../components/index';
import {
  mediaDevices,
  RTCView,
} from 'react-native-webrtc';
import {connect} from 'react-redux';
import {joinRoom,muteAudio,muteVideo,endMeeting} from '../store/action/videoAction';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {users} from '../axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class MeetingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: true,
      video: true,
      meetingData:{},
    };
  }

  componentDidMount() {
    const {meetingId, user} = this.props.route.params;
    const {mute, video} = this.state;
    this.getMedia(meetingId, user, mute, video);
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  switchCam = () => {
    //switch camera
    this.state.stream._tracks[1]._switchCamera();
    console.log(this.state.stream);
    this.setState({stream: this.state.stream});
  };

  backAction = () => {
    Alert.alert("Are you sure","you want to End the Meeting ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => this.endMeeting() }
    ]);
    return true;
  };

  getMedia = async(meetingId, user) => {
    let api = await users.getMeetingDetailById(meetingId);
    this.setState({meetingData:api.data});
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
    this.joinRoom();
  };

  joinRoom = () => {
    const {meetingId, user} = this.props.route.params;
    const {stream} = this.state;
    this.props.joinRoom(stream, meetingId, user);
  }

  muteAudio = () => {
    const {meetingId, user} = this.props.route.params;
    const {mute} = this.state;
    this.state.stream._tracks[0].enabled = !mute;
    this.setState({mute: !mute, stream: this.state.stream});
    this.props.muteAudio(this.state.stream,user);
  };

  muteCamera = () => {
    const {meetingId, user} = this.props.route.params;
    const {video} = this.state;
    this.state.stream._tracks[1].enabled = !video;
    this.setState({video: !video, stream: this.state.stream});
    this.props.muteVideo(this.state.stream,user);
  };

  endMeeting = async() => {
    const {stream} = this.state;
    const {meetingId, user} = this.props.route.params;
    let postData = {
      meetingId:meetingId,
      user:user,
    }
    this.props.endMeeting(meetingId,stream,user);
    // let api = await users.endMeeting(postData);
    this.props.navigation.navigate('MeetingList');
  }

  render() {
    const {
      navigation,
      video: {
        myStream,
        streams, 
        remoteStreams
      },
    } = this.props;

    const {mute, video, stream, meetingData} = this.state;
    console.log(myStream, streams, remoteStreams)
    return (
      <Block style={styles.parent}>
        <Block style={styles.child1}>
          <Ionicons
            name="camera-reverse-sharp"
            size={23}
            color="white"
            style={styles.iconStyle}
            onPress={this.switchCam}
          />
          <Text style={styles.topic}>{meetingData['topic']?`${meetingData['topic'].slice(0,28)}...`:'Conference Call...'}</Text>
          <Button style={styles.endBtn} onPress={this.backAction}>
            <Text style={styles.endText}>End</Text>
          </Button>
        </Block>
        <Block style={styles.child2}>
          {myStream ? (
            myStream.stream._tracks[1].enabled == true?(
            <>
              <RTCView streamURL={myStream.stream.toURL()} style={styles.mainRtc} />
            </>
            ):null
          ) : null}
        </Block>
        <Block style={styles.child3}>
          <ScrollView horizontal={true}>
            {streams.length > 0 ? (
              <>
                {streams.map((item, index) => {
                  return (
                    <Block style={styles.scrollChilds} key={index}>
                      {
                        item.stream._tracks[1].enabled == true?(
                          <RTCView
                          streamURL={item.stream.toURL()}
                          style={styles.childRtc}
                        />
                        ):null
                      }
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
                      {
                        item.stream._tracks[1].enabled == true?(
                          <RTCView
                          streamURL={item.stream.toURL()}
                          style={styles.childRtc}
                        />
                        ):null
                      }
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
            <Text style={styles.iconTxt}>{mute ? 'Mute' : 'UnMute'}</Text>
          </Block>
          <Block>
            <FontAwesome5
              name={video ? 'video' : 'video-slash'}
              size={23}
              color={video ? 'white' : 'red'}
              style={styles.iconStyle}
              onPress={this.muteCamera}
            />
            <Text style={styles.iconTxt}>{video ? 'Camera' : 'Turn On'}</Text>
          </Block>
          <Block>
            <Ionicons
              name="people"
              size={23}
              color="white"
              style={styles.iconStyle}
            />
            <Text style={styles.iconTxt}>Participants</Text>
          </Block>
          <Block>
            <Entypo
              name="chat"
              size={23}
              color="white"
              style={styles.iconStyle}
            />
            <Text style={styles.iconTxt}>More</Text>
          </Block>
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = ({video}) => ({video});

const styles = StyleSheet.create({
  topic:{
    color:'white',
  },
  parent: {
    flex: 1,
    height: windowHeight * 0.5,
    backgroundColor: 'black',
  },
  child1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
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
    width: '100%',
    height: 400,
  },
  childRtc: {
    width: '100%',
    height: '100%',
  },
});

export default connect(mapStateToProps, {joinRoom,muteAudio,muteVideo,endMeeting})(MeetingRoom);
