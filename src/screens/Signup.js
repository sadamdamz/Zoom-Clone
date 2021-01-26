import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Block} from 'galio-framework';
import {Input, Button} from '../components';
import {Images, Theme} from '../constants';
import {Google, Facebook} from '../auth';
import {SignUpValidation} from '../helper/formik';
import {Formik} from 'formik';
import auth from '@react-native-firebase/auth';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      errors: {},
      disabled: true,
    };
  }
  handleChange = (value, name) => {
    let data = this.state.data;
    data[name] = value;
    this.setState({data});
  };

  handleSubmit = (datas) => {
    this.setState({loading: true, data: datas});
    this.createEmail();
  };

  createEmail = async () => {
    const {data} = this.state;
    try {
      let api = await auth().createUserWithEmailAndPassword(
        data.email.trim(),
        data.password.trim(),
      );
    } catch (error) {
      console.log(error.code);
      if (error.code === 'auth/invalid-email') {
        alert('Enter Valid Email Adress');
      }
      if (error.code === 'auth/weak-password') {
        alert('Week Password atleast 6 Characters Needed');
      }
      if (error.code === 'auth/email-already-in-use') {
        alert('Email Adress Already in Use');
      }
    }
    this.setState({loading: false});
  };

  render() {
    const {navigation} = this.props;
    const {loading, disabled} = this.state;
    return (
      <ScrollView style={styles.scroll}>
        <Block safe flex style={styles.container}>
          <Formik
            validationSchema={SignUpValidation}
            initialValues={{email: '', password: '', name: '', phone: ''}}
            onSubmit={(values) => this.handleSubmit(values)}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <>
                <Block style={styles.children}>
                  <Text>Name</Text>
                  <Input
                    placeholder="Name"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                  {errors.name && (
                    <Text style={{fontSize: 10, color: 'red'}}>
                      {errors.name}
                    </Text>
                  )}
                </Block>
                <Block style={styles.children}>
                  <Text>Email ID</Text>
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
                </Block>
                <Block style={styles.children}>
                  <Text>Phone Number</Text>
                  <Input
                    placeholder="Phone"
                    type="number-pad"
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                  />
                  {errors.phone && (
                    <Text style={{fontSize: 10, color: 'red'}}>
                      {errors.phone}
                    </Text>
                  )}
                </Block>
                <Block style={styles.children}>
                  <Text>Password</Text>
                  <Input
                    placeholder="Password"
                    password
                    viewPass
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
                </Block>
                <Block style={styles.btnChildren}>
                  <Button
                    style={styles.submitBtn}
                    loading={loading}
                    onPress={handleSubmit}
                    color={Theme.COLORS.BLUE}>
                    <Text style={styles.btnTxt}>Create Account</Text>
                  </Button>
                </Block>
              </>
            )}
          </Formik>
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
          <Block style={styles.account}>
            <Text>Already have an Account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.signIn}>Sign In</Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </ScrollView>
    );
  }
}

export default Signup;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 10,
    alignItems: 'center',
  },
  scroll: {
    backgroundColor: Theme.COLORS.WHITE,
  },
  children: {
    paddingTop: 20,
    width: '90%',
  },
  btnChildren: {
    width: '100%',
    paddingTop: 20,
  },
  submitBtn: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: Theme.SIZES.BTNRADIUS,
  },
  btnTxt: {
    color: Theme.COLORS.WHITE,
    fontWeight: '700',
  },
  account: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  signIn: {
    color: Theme.COLORS.BLUE,
    fontWeight: '700',
    textAlign: 'center',
  },
  imgIcon: {
    height: 50,
    width: 50,
    margin: 25,
  },
});
