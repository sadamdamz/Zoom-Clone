import React, {Component} from 'react';
import {Text, StyleSheet, SafeAreaView} from 'react-native';
import {Button} from '../components/index';
import {Block} from 'galio-framework';
import {Theme} from '../constants';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {user, navigation} = this.props;
    return (
      <SafeAreaView>
        <Block style={styles.container}>
          <Block style={styles.children}>
            <Text>Hello, Welcome!</Text>
          </Block>
          <Block style={styles.children}>
            <Text>{user.email}</Text>
          </Block>
          <Block style={styles.children}>
            <Button
              style={styles.submitBtn}
              onPress={() => navigation.navigate('MeetingList')}
              color={Theme.COLORS.BLUE}>
              <Text style={styles.btnTxt}>Meeting List</Text>
            </Button>
          </Block>
          <Block style={styles.children}>
            <Button
              style={styles.submitBtn}
              onPress={() => navigation.navigate('Invite')}
              color={Theme.COLORS.BLUE}>
              <Text style={styles.btnTxt}>Invite</Text>
            </Button>
          </Block>
        </Block>
      </SafeAreaView>
    );
  }
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  children: {
    justifyContent: 'center',
    margin: 'auto',
  },
  btnTxt: {
    color: 'white',
  },
});
