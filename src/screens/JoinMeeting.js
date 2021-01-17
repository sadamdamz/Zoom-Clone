import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Block } from "galio-framework";
import { Input, Button } from "../components";
import { Theme } from "../constants";

class JoinMeeting extends Component {

  handleChange = (value, name) => {
    console.log(value, name)
  }

  render() {
    return (
      <Block safe flex style={styles.container}>
        <Block style={styles.children}>
          <Text>Email</Text>
          <Input
            placeholder="Email"
            onChangeText={(e) => this.handleChange(e, "email")}
          />
        </Block>
        <Block style={styles.children}>
          <Text>Meeting Key</Text>
          <Input
            placeholder="Meeting Key"
            onChangeText={(e) => this.handleChange(e, "key")}
          />
        </Block>
        <Block style={styles.proceedChild}>
          <Text style={styles.proceed}>Proceed</Text>
        </Block>
      </Block>
    );
  }
}

export default JoinMeeting;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: Theme.COLORS.WHITE,
  },
  children: {
    paddingTop: 20,
    width: "90%",
  },
  proceedChild: {
    width: '100%',
    paddingTop: 20
  },
  proceed: {
    color: Theme.COLORS.BLUE,
    fontWeight: '700',
    textAlign: 'right',
    paddingRight: 40,
    fontSize: 14.5
  }
});
