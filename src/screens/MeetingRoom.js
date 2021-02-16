import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import {Theme} from '../constants';
import {Block} from 'galio-framework';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Button} from '../components/index';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import {connect} from 'react-redux';
import {joinRoom} from '../store/action/videoAction';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class MeetingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: true,
      video: true,
    };
  }

  componentDidMount() {
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
          // this.setData(stream);
          this.props.joinRoom(stream);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  componentWillUnmount() {
    this.setData('');
  }

  setData = (stream) => {
    this.setState({stream: stream});
  };

  muteAudio = () => {
    const {mute} = this.state;
    this.setState({mute: !mute});
  };

  muteCamera = () => {
    const {video} = this.state;
    this.setState({video: !video});
  };

  render() {
    const {
      navigation,
      video: {myStream, streams},
    } = this.props;
    const {mute, video} = this.state;
    // console.log(streams, myStream);
    return (
      <Block style={styles.parent}>
        <Block style={styles.child1}>
          <Button style={styles.endBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.endText}>End</Text>
          </Button>
        </Block>
        <Block style={styles.child2}>
          {myStream ? (
            <>
              <RTCView streamURL={myStream.toURL()} style={styles.mainRtc} />
            </>
          ) : null}
        </Block>
        <Block style={styles.child3}>
          <ScrollView horizontal={true}>
            {streams.length > 0 ? (
              <>
                {streams.map((stream, index) => (
                    <Block style={styles.scrollChilds} key={index}>
                      {stream ? (
                          <RTCView
                            streamURL={stream.toURL()}
                            style={styles.childRtc}
                          />
                       ) : null} 
                    </Block>
                  )
                )}
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
            <Feather
              name="more-horizontal"
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
  parent: {
    flex: 1,
    height: windowHeight * 0.5,
    backgroundColor: 'black',
  },
  child1: {
    flex: 1,
    alignItems: 'flex-end',
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

export default connect(mapStateToProps, {joinRoom})(MeetingRoom);
