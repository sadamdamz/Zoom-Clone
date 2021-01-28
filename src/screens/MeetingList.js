import React, {Component} from 'react';
import {Text, StyleSheet, SafeAreaView, ScrollView, Image} from 'react-native';
import {Block} from 'galio-framework';
import {Theme, Images} from '../constants/index';
import {Card, Button} from '../components';
import UserAvatar from 'react-native-user-avatar';

class MeetingList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {user, navigation} = this.props;
    return (
      <Block style={styles.bgWhite}>
        <Block style={styles.container}>
          <Block style={styles.child1}>
            <UserAvatar
              isPicture={true}
              src={user.photoURL}
              shape="rounded"
              name={user.displayName}
            />
          </Block>
          <Block style={styles.child2}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.userName}>{user.displayName}</Text>
          </Block>
          <Block></Block>
        </Block>
        <Block>
          <Image source={Images.Add} style={styles.AddImage} />
        </Block>
        <ScrollView style={styles.bgColor}>
          <Block>
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Maths Volume 2'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={25}
            />
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Physics'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={30}
            />
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Physics'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={30}
            />
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Science'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={30}
            />

            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'History'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={30}
            />
            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Zology'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={30}
            />

            <Card.MeetingListCard
              img={
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              }
              subject={'Science'}
              date={'11/7/2021'}
              time={'2:30 pm'}
              members={30}
            />
          </Block>
        </ScrollView>

        <Block row style={styles.btnContainer}>
          <Block>
            <Button
              style={styles.signinBtn}
              onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signinTxt}>Join a Meeting</Text>
            </Button>
          </Block>
          <Block>
            <Button
              style={styles.signupBtn}
              onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.signupTxt}>Meet Now</Text>
            </Button>
          </Block>
        </Block>
      </Block>
    );
  }
}

export default MeetingList;

const styles = StyleSheet.create({
  bgWhite: {
    backgroundColor: Theme.COLORS.WHITE,
  },
  bgColor: {
    backgroundColor: Theme.COLORS.WHITE,
    height: '65%',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.COLORS.GRAYBLACK,
    alignItems: 'center',
    height: 70,
  },
  child1: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  child2: {
    paddingLeft: 10,
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
    justifyContent:'center',
    backgroundColor: Theme.COLORS.WHITE
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
