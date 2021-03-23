import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import {Block} from 'galio-framework';
import UserAvatar from 'react-native-user-avatar';
import {Theme, Images} from '../constants/index';


const initialImgState = (props) => {
  let img = props.user._user.photoURL ? props.user._user.photoURL : '';
  return img;
};

const initialNameState = (props) => {
  let name;
  const {user} = props;
  if (user._user.phoneNumber == null && user._user.displayName == null) {
    name = user._user.email;
  } else if (user._user.phoneNumber == null) {
    name = user.displayName;
  } else {
    name = user._user.phoneNumber;
  }
  return name;
};

const Profile = (props) => {
  const [img, setImg] = useState(() => initialImgState(props));
  const [usrName, setUsrName] = useState(() => initialNameState(props));

  return (
    <Block style={styles.container}>
      <Block style={styles.child1}>
      <Image
        style={styles.profilePic}
        source={{uri:img}}
      />
      </Block>
      <Block style={styles.editables}>
      <Block style={styles.editChild}>
        <Text style={styles.txt}>{usrName}</Text>
      </Block>
      <Block style={styles.editChild}>
      <Text style={styles.txt}>About</Text>
      </Block>
      <Block style={styles.editChild}>
      <Text style={styles.txt}>Privacy</Text>
      </Block>
      <Block style={styles.editChildLast}>
      <Text style={styles.txt}>Terms & Conditions</Text>
      </Block>
      </Block>
    </Block>
  );
};

export default Profile;

const styles = StyleSheet.create({
  avarta:{
    backgroundColor:'transparent',
  },
  container:{
    flex:1,
    paddingTop:100,
    paddingLeft:30,
    paddingRight:30,
    alignItems:'center',
  },
  editables:{},
  editChild:{
    borderTopWidth:1,
    borderColor:'grey',
    padding:20,
    justifyContent:'space-between',
    flexDirection:'row',
  },
  editChildLast:{
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:'grey',
    padding:20,
    justifyContent:'space-between',
    flexDirection:'row',
  },
  txt:{
    fontSize:16,
    fontWeight:'bold',
  },
  tinyLogo:{
    height:20,
    marginLeft:20,
  },
  profilePic:{
    height:100,
    width:100,
    borderRadius:50,
    margin:20,
  }
})