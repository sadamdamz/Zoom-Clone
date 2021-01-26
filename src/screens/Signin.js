import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button} from '../components/index';
import {Block} from 'galio-framework';
import {Theme} from '../constants';
import {Input} from '../components';
import auth from '@react-native-firebase/auth';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {},
    };
  }

  handleChange = (value, name) => {
    console.log(name, value);
    let data = this.state;
    data[name] = value;
    this.setState({data});
  };

  handleSubmit = () => {
    console.log('submit');
    this.setState({loading: true});
    this.signinEmail();
  };

  signinEmail = async () => {
    const {data} = this.state;
    try {
      let api = await auth().signInWithEmailAndPassword(
        data.email,
        data.password,
      );
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Incorrect Password');
      }

      if (error.code === 'auth/invalid-email') {
        alert('Email Address is Invalid');
      }
      if (error.code === 'auth/wrong-password') {
        alert('Wrong Password');
      } else {
        alert('Create Account using this Email');
      }
      console.log(error.code);
    }
    // console.log(api);
    this.setState({loading: false});
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
                onChangeText={(e) => this.handleChange(e, 'email')}
              />
              <Text>Password</Text>
              <Input
                placeholder="Password"
                password
                onChangeText={(e) => this.handleChange(e, 'password')}
              />
              <TouchableOpacity onPress={this.handleSubmit}>
                <Text style={styles.signTxt}>Sign Up</Text>
              </TouchableOpacity>
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
