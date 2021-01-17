import React, { Component } from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { Block } from "galio-framework";
import { Input, Button } from "../components";
import { Theme } from "../constants";

class Signup extends Component {
  constructor(props){
    super(props)
  }
  handleChange = (value, name) => {
    console.log(value, name);
  };

  render() {
    return (
      <ScrollView style={styles.scroll}>
        <Block safe flex style={styles.container}>
          <Block style={styles.children}>
            <Text>Name</Text>
            <Input
              placeholder="Name"
              onChangeText={(e) => this.handleChange(e, "name")}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Email ID</Text>
            <Input
              placeholder="Email"
              onChangeText={(e) => this.handleChange(e, "email")}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Phone Number</Text>
            <Input
              placeholder="phone"
              onChangeText={(e) => this.handleChange(e, "phone")}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Create Password</Text>
            <Input
              placeholder="password"
              password
              viewPass
              onChangeText={(e) => this.handleChange(e, "name")}
            />
          </Block>
          <Block style={styles.children}>
            <Text>Retype Password</Text>
            <Input
              placeholder="confirmPassword"
              password
              viewPass
              onChangeText={(e) => this.handleChange(e, "confirmPassword")}
            />
          </Block>
          <Block style={styles.btnChildren}>
            <Button style={styles.submitBtn}>
              <Text style={styles.btnTxt}>Create Account</Text>
            </Button>
          </Block>
        </Block>
      </ScrollView>
    );
  }
}

export default Signup;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  scroll: {
    backgroundColor: Theme.COLORS.WHITE,
  },
  children: {
    paddingTop: 20,
    width: "90%",
  },
  btnChildren: {
    width: "100%",
    paddingTop: 20,
  },
  submitBtn: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: Theme.COLORS.BLUE,
    borderRadius: Theme.SIZES.BTNRADIUS,
  },
  btnTxt: {
    color: Theme.COLORS.WHITE,
    fontWeight: "700",
  },
});
