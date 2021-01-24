import React, {Component} from 'react';
import {StyleSheet, Text, SafeAreaView, ScrollView} from 'react-native';
import {Button} from '../components/index';
import {Block} from 'galio-framework';
import {Theme} from '../constants';
import {Input} from '../components';

class Signin extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (value, name) => {
    console.log(value, name);
  };

  render() {
    const {navigation} = this.props;
    return (
      <Block style={styles.appContainer}>
        <SafeAreaView style={styles.safeArea}>
          <Block style={styles.container}>
            <Button
              size="small"
              onPress={() => navigation.navigate('Joinmeeting')}
              style={styles.joinBtn}>
              <Text style={styles.txtColor}>Join A Meeting</Text>
            </Button>
          </Block>
          <Block style={styles.btnContainer}>
            <ScrollView>
              <Text>Email</Text>
              <Input
                placeholder="Email"
                onChangeText={(e) => this.handleChange(e, 'name')}
              />
              <Text>Password</Text>
              <Input
                placeholder="Password"
                onChangeText={(e) => this.handleChange(e, 'password')}
              />
              <Text style={styles.signTxt}>Sign Up</Text>
            </ScrollView>
          </Block>
        </SafeAreaView>
      </Block>
    );
  }
}

export default Signin;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Theme.COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  safeArea: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 2,
    backgroundColor: Theme.COLORS.BLUE,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    backgroundColor: Theme.COLORS.WHITE,
    paddingTop: 60,
    height: '100%',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  joinBtn: {
    backgroundColor: Theme.COLORS.WHITE,
    color: Theme.COLORS.BLUE,
    borderRadius: Theme.SIZES.BTNRADIUS,
    width: 200,
  },
  txtColor: {
    color: Theme.COLORS.BLUE,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  signTxt: {
    color: Theme.COLORS.BLUE,
    fontWeight: '700',
    borderBottomColor: Theme.COLORS.BLUE,
    textAlign: 'center',
    paddingTop: 20,
  },
});
