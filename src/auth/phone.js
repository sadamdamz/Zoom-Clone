import React, {useState} from 'react';
import {Button, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';

export const signInWithPhoneNumber = async (phoneNumber) => {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  return confirmation;
};

export const confirmOtp = async (confirm, otp) => {
  try {
    let data = await confirm.confirm(otp);
    return data;
  } catch (error) {
    return error;
  }
};
