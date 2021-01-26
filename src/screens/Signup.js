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

class Signup extends Component {
  constructor(props) {
    super(props);
  }
  handleChange = (value, name) => {
    console.log(value, name);
  };

  render() {
    const {navigation} = this.props;
    return (
      <ScrollView style={styles.scroll}>
        <Block safe flex style={styles.container}>
          <Block style={styles.children}>
            <Text>Name</Text>
            <Input
              placeholder="Name"
              onChangeText={(e) => this.handleChange(e, 'name')}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Email ID</Text>
            <Input
              placeholder="Email"
              onChangeText={(e) => this.handleChange(e, 'email')}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Phone Number</Text>
            <Input
              placeholder="phone"
              onChangeText={(e) => this.handleChange(e, 'phone')}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Create Password</Text>
            <Input
              placeholder="password"
              password
              viewPass
              onChangeText={(e) => this.handleChange(e, 'name')}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Retype Password</Text>
            <Input
              placeholder="confirmPassword"
              password
              viewPass
              onChangeText={(e) => this.handleChange(e, 'confirmPassword')}
            />
          </Block>
          <Block style={styles.btnChildren}>
            <Button style={styles.submitBtn}>
              <Text style={styles.btnTxt}>Create Account</Text>
            </Button>
          </Block>
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
    backgroundColor: Theme.COLORS.BLUE,
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
