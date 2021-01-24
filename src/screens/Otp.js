import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Block} from 'galio-framework';

const Otp = (props) => {
  const {navigation} = props;
  console.log(navigation.getParam('data'));
  return (
    <Block>
      <Text>Otp</Text>
    </Block>
  );
};

export default Otp;
