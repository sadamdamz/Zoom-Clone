import React, {Component} from 'react';
import {Text, StyleSheet, Image} from 'react-native';
import {Block} from 'galio-framework';
import {Theme, Images} from '../constants/index';
import {Input, Button} from '../components';

class Invite extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const {navigation} = this.props;
    return (
      <Block safe={true} style={styles.container}>
        <Block>
          <Text style={styles.inviteTxt}>INVITE PARTICIPANTS</Text>
          <Text style={styles.content}>
            Share the below linkor meeting ID to let participants join your
            meeting
          </Text>
        </Block>
        <Block row={true} style={styles.child2}>
          <Text style={styles.meetingLink}>
            https://meeting?432&dkfnacisdosos==
          </Text>
          <Image style={styles.copyIcon} source={Images.Copy} />
        </Block>
        <Block row={true} style={styles.child2}>
          <Text style={styles.meetingId}>7899289</Text>
          <Image style={styles.copyIcon} source={Images.Copy} />
        </Block>
        <Block style={styles.child3}>
          <Input
            placeholder="Add Participants"
            onChangeText={(e)=>console.log(e)}
            style={styles.input}
          />
        </Block>
        <Block style={styles.child4}>
        <Image style={styles.emailIcon} source={Images.Email} />
        </Block>
        <Block style={styles.child5}>
        <Button
            style={styles.sendBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.sendTxt}>Send</Text>
          </Button>
        </Block>
      </Block>
    );
  }
}

export default Invite;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.WHITE,
    height: '100%',
  },
  child2: {
    textAlign: 'center',
    paddingTop: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
  },
  child3: {
    paddingTop: 20,
  },
  child4: {
    paddingTop: 90
  },
  child5: {
    paddingTop: 30,
    alignItems: 'center'
  },
  sendBtn: {
    backgroundColor: Theme.COLORS.BLUE,
    borderRadius: Theme.SIZES.BTNRADIUS,
  },
  sendTxt: {
    color: Theme.COLORS.WHITE,
    fontWeight: '700',
  },
  emailIcon: {
    width: 150,
    height: 150,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  inviteTxt: {
    width: '100%',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: Theme.COLORS.GRAYBLACK,
  },
  content: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
    fontWeight: '300',
    marginLeft: 70,
    marginRight: 70,
    color: Theme.COLORS.GRAYBLACK,
  },
  meetingLink: {
    color: Theme.COLORS.BLUE,
  },
  copyIcon: {
    height: 40,
    width: 30,
    marginLeft: 10,
  },
});
