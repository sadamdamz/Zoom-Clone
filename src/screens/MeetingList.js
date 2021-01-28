import React, {useState} from 'react';
import {Text, StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import {Block} from 'galio-framework';
import {Theme, Images} from '../constants/index';
import {Card, Button} from '../components';
import UserAvatar from 'react-native-user-avatar';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import OptionsMenu from 'react-native-options-menu';
import auth from '@react-native-firebase/auth';

const initialLayout = {width: Dimensions.get('window').width};

const UpcomingList = () => {
  return (
    <ScrollView style={styles.bgColor}>
      <Block style={styles.bgWhite}>
        {[1, 2, 3, 4, 5, 6].map((item, index) => {
          return (
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Maths Volume 2'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={25}
            />
          );
        })}
      </Block>
    </ScrollView>
  );
};

const PastList = () => {
  return (
    <ScrollView style={styles.bgColor}>
      <Block style={styles.bgWhite}>
        {[1, 2, 3, 4, 5, 6].map((item, index) => {
          return (
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Maths Volume 2'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={25}
            />
          );
        })}
      </Block>
    </ScrollView>
  );
};

const MeetingList = (props) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'upcoming', title: 'UpcomingList'},
    {key: 'past', title: 'PastList'},
  ]);

  const {user, navigation} = props;

  const signOut = async () => {
    console.log('signout');
    await auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const renderScene = SceneMap({
    upcoming: UpcomingList,
    past: PastList,
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
      <Block safe={true} style={styles.bgWhite}>
        <Block row style={styles.container}>
          <Block left={true} style={styles.child1}>
            <UserAvatar
              isPicture={true}
              src={user.photoURL}
              shape="rounded"
              name={user.displayName}
            />
          </Block>
          <Block left={true} style={styles.child2}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.userName}>{user.displayName}</Text>
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
              options={['Logout', 'Cancel']}
              actions={[signOut]}
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
            onPress={() => navigation.navigate('JoinMeeting')}
            >
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
    marginLeft: 10
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