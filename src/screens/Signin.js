import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button} from '../components/index';
import {Images, Theme} from '../constants';
import {Block} from 'galio-framework';
import {Input} from '../components';
import {LoginValidation} from '../helper/formik';
import {Formik} from 'formik';
import {Google, Facebook} from '../auth';
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

  handleSubmit = (values) => {
    this.setState({data: values});
    this.setState({loading: true});
    this.signinEmail();
  };

  signinEmail = async () => {
    const {data} = this.state;
    try {
      let api = await auth().signInWithEmailAndPassword(
        data.email.trim(),
        data.password.trim(),
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
      }
      if (error.code === 'auth/user-not-found') {
        alert('Account Not Found');
      }
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
          <ScrollView>
          <Formik
            validationSchema={LoginValidation}
            initialValues={{email: '', password: ''}}
            onSubmit={(values) => this.handleSubmit(values)}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <Block style={styles.btnContainer}>
                {/* <ScrollView> */}
                  <Text>Email</Text>
                  <Input
                    placeholder="Email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {errors.email && (
                    <Text style={{fontSize: 10, color: 'red'}}>
                      {errors.email}
                    </Text>
                  )}
                  <Text>Password</Text>
                  <Input
                    placeholder="Password"
                    password
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                  />
                  {errors.password && (
                    <Text style={{fontSize: 10, color: 'red'}}>
                      {errors.password}
                    </Text>
                  )}
                  <TouchableOpacity onPress={handleSubmit}>
                    <Text style={styles.signTxt}>Sign In</Text>
                  </TouchableOpacity>
                {/* </ScrollView> */}
              </Block>
            )}
          </Formik>
          <Text style={styles.orTxt} >(or)</Text>
          <Block row space="around" style={styles.loginUsing}>
            <Block>
              <TouchableOpacity
                onPress={() =>
                  Facebook().then(() => console.log('Signed in with FaceBook!'))
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
                onPress={() => navigation.navigate('Phone Verification')}>
                <Image source={Images.Whatsapp} style={styles.imgIcon} />
              </TouchableOpacity>
            </Block>
          </Block>
          </ScrollView>

        </SafeAreaView>
      </Block>
    );
  }
}

export default Signin;

const styles = StyleSheet.create({
  imgIcon: {
    height: 50,
    width: 50,
    margin: 25,
  },
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
    flex: 7,
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
  orTxt: {
    textAlign: 'center',
    paddingTop: 20,
  }
});
