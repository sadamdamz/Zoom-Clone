import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  BackHandler,
  Alert,
  View,
  DeviceEventEmitter,
  FlatList,
  StatusBar,
  SafeAreaView,
  AppState,
} from 'react-native';
import {Theme} from '../constants';
import {Block} from 'galio-framework';
import {Button, Chat} from '../components/index';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import {connect} from 'react-redux';
import {
  joinRoom,
  muteAudio,
  muteVideo,
  endMeeting,
  sendMessage
} from '../store/action/videoAction';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {users} from '../axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import UserAvatar from 'react-native-user-avatar';
import {getDefaultName, getUserAvartar} from '../helper/userData';
import InCallManager from 'react-native-incall-manager';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class MeetingRoom extends Component {
  constructor(props) {
    super(props);
    this.appState = AppState.currentState;
    this.state = {
      mute: true,
      video: true,
      speaker: false,
      meetingData: {},
      orientation: '',
      activeIndex: 0,
      messages: [],
      appStateVisible: this.appState.current,
      refreshFlatList: false,
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  }

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({orientation: 'portrait', height:Dimensions.get('window').height, width: Dimensions.get('window').width});
    } else {
      this.setState({orientation: 'landscape', height:Dimensions.get('window').height, width: Dimensions.get('window').width});
    }
  };

  componentDidMount() {
    const {meetingId, user} = this.props.route.params;
    const {mute, video} = this.state;
    this.getOrientation();
    this.getMedia(meetingId, user, mute, video);
    this.props.sendMessage(meetingId, []);
    Dimensions.addEventListener('change', () => {
      this.getOrientation();
    });
    AppState.addEventListener("change", this._handleAppStateChange);
    DeviceEventEmitter.addListener('Proximity', function (data) {
      // --- do something with events
    });
    DeviceEventEmitter.addListener('WiredHeadset', function (data) {
      // --- do something with events
    });
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    Dimensions.removeEventListener('change',this.getOrientation);
    InCallManager.stop();
    InCallManager.setSpeakerphoneOn(false);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      nextAppState === "active"
    ) {
    }
    this.setState({appStateVisible: nextAppState});
  };

  switchCam = () => {
    //switch camera
    this.state.stream._tracks[1]._switchCamera();
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

  showLostConnection = () => {
    Alert.alert('Network Failed', 'you Lost your Connection', [
      {text: 'Ok', onPress: () => this.endMeeting()},
    ]);
    return true;
  }

  getMedia = async (meetingId, user) => {
    let api = await users.getMeetingDetailById(meetingId);
    this.setState({meetingData: api.data});
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
    InCallManager.start({media: 'audio'});
    InCallManager.setSpeakerphoneOn(false);
    InCallManager.setKeepScreenOn(true);
    this.joinRoom();
  };

  handleSpeaker = () => {
    const {speaker} = this.state;
    this.setState({speaker: !speaker}, () => {
      InCallManager.setSpeakerphoneOn(this.state.speaker);
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
    const {meetingId, user,} = this.props.route.params;
    const {video:{myStream}} = this.props;
    const {video} = this.state;
    myStream.stream._tracks[1].enabled = !video;
    this.setState({video: !video, stream: myStream});
    this.props.muteVideo(myStream, user);
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

  _renderItem = ({item, index}) => {
    const {orientation, height, width} = this.state;
    let scrHeight = height;
    let srcWidth = width;
    let itemHeight =
      orientation === 'landscape' ? scrHeight - 150 : scrHeight - 180;
    let numColumns = orientation === 'landscape' ? 4 : 2;
    if (item.data.length <= 2) {
      numColumns = orientation === 'landscape' ? 2 : 1;
    }

    console.log('items height and width=======>', itemHeight, srcWidth, numColumns, item);

    return (
      <View
        style={{
          backgroundColor: 'black',
          borderRadius: 5,
          height: itemHeight,
          width: width,
          marginVertical: 40,
        }}
        key={index}>

        <FlatList
          data={item.data}
          style={{backgroundColor: 'black'}}
          extraData={orientation}
          numColumns={numColumns}
          key={numColumns}
          renderItem={({item, index}) => 
            <View
              style={[
                styles.scrollChilds,
                {
                  height:
                    orientation === 'landscape' ? itemHeight : itemHeight / 2,
                    alignSelf: 'stretch',
                },
              ]}
              key={index}>
              {item.stream !== null ? ( 
                  <>
                    <RTCView
                      objectFit="cover"
                      streamURL={item.cam === true?item.stream.toURL():''}
                      style={[
                        styles.childRtc,
                        {
                          height: orientation === 'landscape' ? itemHeight : itemHeight / 2,
                          alignSelf: 'stretch',
                        },
                      ]}
                    />
                  </>):null}
            </View>
          }
        />
       </View>
    );
  };

  pagination(list) {
    const {carouselItems, activeIndex} = this.state;
    return (
      <Pagination
        dotsLength={list.length}
        activeDotIndex={activeIndex}
        // containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  closeChat = () => {
    this.chatSheet.close()
  }
  

  render() {
    const {
      video: {myStream, streams, remoteStreams, allStreams, final, messages, connectionLost, users},
      sendMessage
    } = this.props;
    const {
      mute,
      video,
      speaker,
      stream,
      orientation,
      meetingData,
      appStateVisible,
      width,
      height
    } = this.state;
    const {user, meetingId} = this.props.route.params;
    let list = [];
    let helper = [myStream,...streams,...remoteStreams]
    if (myStream) {
      list = [{data: []}];
      let i = 0;
      helper?.map((item, index) => {
        let val = index;
        let addObj = val % 4;
        if (addObj === 0 && val!==0) {
          list.push({data: []});
          i = i + 1;
        }
        item['key'] = index.toString();
        if(item.stream?._tracks[1].enabled){
          item['cam'] = true
        }else{
          item['cam'] = false
        }
        list[i].data.push(item);
      });
    }
    return (
      <Block style={[styles.parent, {height:height * 0.5}]}>
        <StatusBar hidden />
        {/* {connectionLost===true && this.showLostConnection()} */}
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
        <RBSheet
          ref={(ref) => {
            this.chatSheet = ref;
          }}
          height={height - 20}
          openDuration={250}
          customStyles={{}}>
          <SafeAreaView style={styles.container}>
            <Chat user={user} sendMessage={sendMessage} roomId={meetingId} messages={messages} onClose={this.closeChat}/>
          </SafeAreaView>
        </RBSheet>
        <Block style={[styles.child1, {marginTop:orientation==='landscape'?13:0}]}>
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
        {/* ######################## */}
        {myStream?.stream ? (
          <View
            style={{flex: 9, justifyContent: 'center', position: 'relative'}}>
            <View style={{flex: 4}}>
              <Carousel
                layout={'default'}
                ref={(ref) => (this.carousel = ref)}
                data={list}
                sliderWidth={width}
                itemWidth={1000}
                renderItem={this._renderItem}
                onSnapToItem={(index) => this.setState({activeIndex: index})}
              />
            </View>
            <View
              style={{
                height: 70,
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
              }}>
              {this.pagination(list)}
            </View>
          </View>
        ) : null}

        <Block style={[styles.child4, {marginBottom:orientation==='landscape'?20:0, marginTop: orientation==='landscape'?-30:-10}]}>
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
              onPress={() => this.chatSheet.open()}
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    width: windowWidth,
  },
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
    // height: windowHeight * 0.5,
    backgroundColor: 'black',
  },
  child1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: -30
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
    // height: 200,
    // width: 300,
    // borderColor: 'white',
    // borderWidth: 1,
    flex: 1,
    // alignItems: 'center',
  },
  mainRtc: {
    width: responsiveScreenWidth(100),
    height: responsiveScreenHeight(40),
  },
  childRtc: {
    // width: responsiveScreenWidth(100),
    // height: responsiveScreenHeight(20),
  },
});

export default connect(mapStateToProps, {
  joinRoom,
  muteAudio,
  muteVideo,
  endMeeting,
  sendMessage,
})(MeetingRoom);
