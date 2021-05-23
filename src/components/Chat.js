import React, {useState, useCallback, useEffect} from 'react';
import {Keyboard, Platform, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {getDefaultName, getUserAvartar} from '../helper/userData';

const Chat = (props) => {

  const {user, sendMessage, roomId, messages} = props;
  const [paddingBottom, setPaddingBottom] = useState(0);

  useEffect(() => {

    if (Platform.OS !== 'android' ) {
      return;
    }

    Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setPaddingBottom(e.endCoordinates.height);
      },
    );

    Keyboard.addListener('keyboardDidHide', () => {
      console.log('keyboard hide evnet')
      setPaddingBottom(0);
    });

    return () => {
      Keyboard.removeListener();
      Keyboard.removeListener();
    };
  }, [Keyboard]);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ]);
  // }, []);

  const getUser = (user) => {
    let avatar = getUserAvartar(user);
    let data = {
      _id: user.uid,
      name: getDefaultName(user),
    }
    if(avatar!==null){
      data['avatar'] = avatar;
    }
    return data
  };

  const onSend = useCallback((message = []) => {
    console.log('messages=====>', message);
    sendMessage(roomId,message);
    // setMessages((previousMessages) =>
      GiftedChat.append(messages, message)
    // );
  }, []);


  return (
    <View style={{flex: 1, paddingBottom:paddingBottom}}>
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

export default Chat;
