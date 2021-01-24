import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button} from '../components/index';
import {Block} from 'galio-framework';
import {Images, Theme} from '../constants';
import {Google, Facebook} from '../auth';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '798089911453-hf7cbe3c49imvd0oc1ek624u6q2h4hh3.apps.googleusercontent.com',
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: '',
    };
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.appContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Button
              size="small"
              onPress={() => navigation.navigate('Joinmeeting')}
              style={styles.joinBtn}>
              <Text style={styles.txtColor}>Join A Meeting</Text>
            </Button>
          </View>
          <View style={styles.btnContainer}>
            <Block row>
              <Block>
                <Button
                  style={styles.signupBtn}
                  onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupTxt}>SIGN UP</Text>
                </Button>
              </Block>
              <Block>
                <Button
                  style={styles.signinBtn}
                  onPress={() => navigation.navigate('Signin')}>
                  <Text style={styles.signinTxt}>SIGN IN</Text>
                </Button>
              </Block>
            </Block>
            <Block row space="around" style={styles.loginUsing}>
              <Block>
                <Image source={Images.Mail} style={styles.imgIcon} />
              </Block>
              <Block>
                <TouchableOpacity
                  onPress={() =>
                    Facebook().then(() =>
                      console.log('Signed in with FaceBook!'),
                    )
                  }>
                  <Image source={Images.Facebook} style={styles.imgIcon} />
                </TouchableOpacity>
              </Block>
              <Block>
                <TouchableOpacity
                  onPress={() =>
                    Google().then(() => console.log('Signed in with Google!'))
                  }>
                  <Image source={Images.Google} style={styles.imgIcon} />
                </TouchableOpacity>
              </Block>
              <Block>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MeetingRoom')}>
                  <Image source={Images.Whatsapp} style={styles.imgIcon} />
                </TouchableOpacity>
              </Block>
            </Block>
            <Block>
              <Text style={styles.signTxt}>Sign Up Using</Text>
            </Block>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default Home;

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
    alignItems: 'center',
    paddingTop: 60,
    height: '100%',
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
  imgIcon: {
    height: 50,
    width: 50,
    margin: 25,
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
  signTxt: {
    color: Theme.COLORS.BLUE,
    fontWeight: '700',
    borderBottomColor: Theme.COLORS.BLUE,
  },
});
