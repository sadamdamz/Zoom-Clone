import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Block} from 'galio-framework';
import {Theme, Images} from '../constants/index';
import {Card, Button} from '../components';
import UserAvatar from 'react-native-user-avatar';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import OptionsMenu from 'react-native-options-menu';
import auth from '@react-native-firebase/auth';
import {users} from '../axios';
import Spinner from 'react-native-loading-spinner-overlay';

const initialLayout = {width: Dimensions.get('window').width};

const UpcomingList = (props) => {
  const {meetingList, navigation, user} = props;
  if(meetingList && Object.keys(meetingList).length>0){
  return (
    <ScrollView style={styles.bgColor}>
      <Block style={styles.bgWhite}>
        {Object.keys(meetingList).map((item, index) => {
          return (
            <TouchableOpacity onPress={()=>navigation.navigate('InviteDetail',{meetingId: meetingList[item].meetingId,
              user: user._user.uid, show:true})} key={index}>
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={meetingList[item].topic}
              date={meetingList[item].date}
              time={meetingList[item].time}
              duration={meetingList[item].duration}
              {...props}
            />
            </TouchableOpacity>
          );
        })}
      </Block>
    </ScrollView>
  );
}else{
  return null
}
};

const PastList = (props) => {
  const {meetingList, navigation, user} = props;
  if(meetingList && Object.keys(meetingList).length>0){
  return (
    <ScrollView style={styles.bgColor}>
      <Block style={styles.bgWhite}>
        {Object.keys(meetingList).map((item, index) => {
          return (
            <TouchableOpacity onPress={()=>navigation.navigate('InviteDetail',{meetingId: meetingList[item].meetingId,
              user: user._user.uid, show:true})} key={index}>
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={meetingList[item].topic}
              date={meetingList[item].date}
              time={meetingList[item].time}
              duration={meetingList[item].duration}
              {...props}
            />
              </TouchableOpacity>
          );
        })}
      </Block>
    </ScrollView>
  );
  }else{
    return null
  }
};

const initialImgState = (props) => {
  let img = props.user._user.photoURL ? props.user._user.photoURL : '';
  return img;
};

const initialNameState = (props) => {
  let name;
  const {user} = props;
  if (user._user.phoneNumber == null && user._user.displayName == null) {
    name = user._user.email;
  } else if (user._user.phoneNumber == null) {
    name = user.displayName;
  } else {
    name = user._user.phoneNumber;
  }
  return name;
};

const MeetingList = (props) => {
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState(null);
  const [meetingList, setMeetingList] = useState([]);
  const [index, setIndex] = useState(0);
  const [img, setImg] = useState(() => initialImgState(props));
  const [usrName, setUsrName] = useState(() => initialNameState(props));
  const [routes] = useState([
    {key: 'upcoming', title: 'UpcomingList'},
    {key: 'past', title: 'PastList'},
  ]);

  const {user, navigation} = props;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMeetingList();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getMeetingList();
  }, []);

  const getMeetingList = async () => {
    setSpinner(true);
    let postData = {
      uid: user._user.uid,
      name: usrName,
      img: img,
    };
    let api = await users.getMeetingList(postData);
    let data = await api.Data;
    setMeetingList(data.meetings);
    setData(data);
    setSpinner(false);
    console.log(data);
  };

  const signOut = async () => {
    await auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const accRedirect = () => {
    props.navigation.navigate('Profile');
  };

  const upcome = () => {
    return (
      <UpcomingList meetingList={meetingList} {...props}/>
    )
  }

  const past = () => {
    return(
      <PastList meetingList={meetingList} {...props}/>
    )
  }

  const renderScene = SceneMap({
    upcoming: upcome,
    past: past,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: Theme.COLORS.WHITE}}
      style={{backgroundColor: Theme.COLORS.GRAYBLACK}}
    />
  );

  return (
    <>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Block safe={true} style={styles.bgWhite}>
        <Block row style={styles.container}>
          <Block left={true} style={styles.child1}>
            <UserAvatar
              isPicture={true}
              src={img}
              shape="rounded"
              name={usrName}
            />
          </Block>
          <Block left={true} style={styles.child2}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.userName}>{usrName}</Text>
          </Block>
          <Block right={true} style={styles.child3}>
            <OptionsMenu
              button={Images.Settings}
              buttonStyle={{
                width: 32,
                height: 20,
                margin: 7.5,
                resizeMode: 'contain',
              }}
              destructiveIndex={1}
              options={['Account', 'Logout']}
              actions={[accRedirect, signOut]}
            />
            {/* <Text>hello</Text> */}
          </Block>
        </Block>
        <Block>
          <Image source={Images.Add} style={styles.AddImage} />
        </Block>
      </Block>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
      <Block row style={styles.btnContainer}>
        <Block>
          <Button
            style={styles.signinBtn}
            onPress={() => navigation.navigate('JoinMeeting')}>
            <Text style={styles.signinTxt}>Join a Meeting</Text>
          </Button>
        </Block>
        <Block>
          <Button
            style={styles.signupBtn}
            onPress={() => navigation.navigate('Invite')}>
            <Text style={styles.signupTxt}>Meet Now</Text>
          </Button>
        </Block>
      </Block>
    </>
  );
};

export default MeetingList;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: Theme.COLORS.WHITE,
  },
  bgWhite: {
    backgroundColor: Theme.COLORS.WHITE,
  },
  bgColor: {
    height: '65%',
  },
  container: {
    backgroundColor: Theme.COLORS.GRAYBLACK,
    height: 70,
  },
  child1: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  child2: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  child3: {
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 10,
  },
  userName: {
    color: Theme.COLORS.WHITE,
  },
  welcome: {
    color: Theme.COLORS.Disable,
  },
  AddImage: {
    width: '100%',
    height: 150,
  },
  btnContainer: {
    justifyContent: 'center',
    backgroundColor: Theme.COLORS.WHITE,
  },
  signinBtn: {
    backgroundColor: Theme.COLORS.BLUE,
    borderRadius: Theme.SIZES.BTNRADIUS,
  },
  signupBtn: {
    backgroundColor: Theme.COLORS.WHITE,
    borderColor: Theme.COLORS.BLUE,
    borderWidth: 1.2,
    borderRadius: Theme.SIZES.BTNRADIUS,
  },
  signupTxt: {
    color: Theme.COLORS.BLUE,
    fontWeight: '700',
  },
  signinTxt: {
    color: Theme.COLORS.WHITE,
    fontWeight: '700',
  },
});
