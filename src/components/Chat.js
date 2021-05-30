import React, {useState, useCallback, useEffect} from 'react';
import {Keyboard, Platform, Text, View, StyleSheet} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {getDefaultName, getUserAvartar} from '../helper/userData';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

const Chat = (props) => {
  const {user, sendMessage, roomId, messages} = props;
  const [paddingBottom, setPaddingBottom] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    Keyboard.addListener('keyboardDidShow', (e) => {
      setPaddingBottom(e.endCoordinates.height);
    });

    Keyboard.addListener('keyboardDidHide', () => {
      console.log('keyboard hide evnet');
      setPaddingBottom(0);
    });

    return () => {
      Keyboard.removeListener();
      Keyboard.removeListener();
    };
  }, [Keyboard]);

  const getUser = (user) => {
    let avatar = getUserAvartar(user);
    let data = {
      _id: user.uid,
      name: getDefaultName(user),
    };
    if (avatar !== null) {
      data['avatar'] = avatar;
    }
    return data;
  };

  const onSend = useCallback((message = []) => {
    console.log('messages=====>', message);
    sendMessage(roomId, message);
    GiftedChat.append(messages, message);
  }, []);

  return (
    <View style={{flex: 1, paddingBottom: paddingBottom}}>
      <AntDesign
        name={'closecircleo'}
        size={23}
        color="black"
        style={styles.iconStyle}
        onPress={props.onClose}
      />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={getUser(user)}
        isKeyboardInternallyHandled={false}
        renderUsernameOnMessage={true}
        keyboardShouldPersistTaps="never"
        showUserAvatar={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    position:'absolute',
    right:10,
    top:0,
    zIndex:2,
  }
})

export default Chat;
