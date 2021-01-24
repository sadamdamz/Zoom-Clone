/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';
import {Block} from 'galio-framework';
import {Button} from '../components';
import PhoneInput from 'react-native-phone-number-input';
import OTPTextInput from 'react-native-otp-textinput';
import { Theme} from '../constants';
import {signInWithPhoneNumber} from '../auth/phone';


const PhoneVerify = (props) => {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [otp, setOtp] = useState(null);
  const {navigation} = props;

  const signin = async(number) => {
    setLoading(true);
    let data = await signInWithPhoneNumber(number);
    setLoading(false);
    setConfirm(data);
  };

  const handleOtp = async(e) => {
    setOtp(e);
  };

  const verify = async() => {
    setLoading(true);
    try {
      await confirm.confirm(otp);
      navigation.navigate('Home');
    } catch (error) {
      alert('Wrong Otp');
    }
    setLoading(false);
  };


  return (
    <SafeAreaView>
      <Block style={styles.container}>
        {
          !confirm ? (
            <>
            <Block style={styles.childText}>
            <Text style={styles.text}>Please Input Your Mobile Phone Number</Text>
          </Block>
          <Block style={styles.input}>
            <PhoneInput
              defaultValue={value}
              defaultCode="IN"
              layout="first"
              onChangeText={(text) => {
                setValue(text);
              }}
              onChangeFormattedText={(text) => {
                console.log(text);
                setFormattedValue(text);
              }}
              withShadow
              autoFocus
            />
          </Block>
          <Block style={styles.btn}>
            <Button
              style={styles.signinBtn}
              loading={loading}
              onPress={() => signin(formattedValue)}>
              <Text style={styles.signinTxt}>Continue</Text>
            </Button>
          </Block>
          </>
          ) : (
            <>
            <Block style={styles.childText}>
            <Text style={styles.text}>Enter OTP</Text>
          </Block>
          <Block>
            <OTPTextInput handleTextChange={(e)=>handleOtp(e)} inputCount={6} tintColor={Theme.COLORS.BLUE}/>
          </Block>
          <Block style={styles.btn}>
            <Button
              style={styles.signinBtn}
              loading={loading}
              onPress={() => verify()}>
              <Text style={styles.signinTxt}>Verify</Text>
            </Button>
          </Block>
            </>
          )
        }
      </Block>
    </SafeAreaView>
  );
};

export default PhoneVerify;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 14,
  },
  signinBtn: {
    backgroundColor: Theme.COLORS.BLUE,
    borderRadius: Theme.SIZES.BTNRADIUS,
  },
  signinTxt: {
    color: Theme.COLORS.WHITE,
    fontWeight: '700',
  },
  btn: {
    paddingTop:30,
  },
});
