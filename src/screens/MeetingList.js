import React, {Component} from 'react';
import {Text, StyleSheet, SafeAreaView, ScrollView, Image} from 'react-native';
import {Block} from 'galio-framework';
import {Theme, Images} from '../constants/index';
import {Card} from '../components';
import UserAvatar from 'react-native-user-avatar';

class MeetingList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {user} = this.props;
    console.log(user.photoURL);
    return (
      <SafeAreaView>
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
          <Block>

          </Block>
        </Block>
          <Block>
          <Image source={Images.Add} style={styles.AddImage} />
          </Block>
        <ScrollView style={styles.bgColor}>
          <Block>
            <Card.MeetingListCard
              img={'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
              subject={"Maths Volume 2"}
              date={"11/7/202"}
              time={"2:30 pm"}
              members={25}
            />
                        <Card.MeetingListCard
              img={'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
              subject={"Maths Volume 2"}
              date={"11/7/202"}
              time={"2:30 pm"}
              members={25}
            />
          </Block>
        </ScrollView>
          <Block></Block>
      </SafeAreaView>
    );
  }
}

export default MeetingList;

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: Theme.COLORS.WHITE,
    height:'100%'
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.COLORS.GRAYBLACK,
    alignItems: 'center',
    height:70
  },
  child1: {
    flexDirection: 'row',
    paddingLeft: 10
  },
  child2: {
    paddingLeft: 10
  },
  userName: {
    color: Theme.COLORS.WHITE,
  },
  welcome: {
    color: Theme.COLORS.Disable,
  },
  AddImage: {
    width:'100%',
    height: 150
  }
});
