import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { Input } from "galio-framework";

import Icon from './Icon';
import { Theme } from "../constants";

class ArInput extends React.Component {

  handleText = (e) => {
    console.log(e)
    this.props.onChangeText(e)
  }

  render() {
    const { shadowless, success, error, primary,name,iconName } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless,
      success && styles.success,
      error && styles.error,
      primary && styles.primary,
      {...this.props.style}
    ];

    return (
      <Input
        placeholderTextColor={Theme.COLORS.MUTED}
        style={inputStyles}
        color={Theme.COLORS.HEADER}
        onChangeText={(e)=>this.handleText(e)}
        iconContent={
          <Icon
            size={14}
            color={Theme.COLORS.ICON}
            name={iconName}
            family="AntDesign"
          />
        }
        name={name}
        {...this.props}
      />
    );
  }
}

ArInput.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false,
  name: ""
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  primary: PropTypes.bool,
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderColor: Theme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderColor: Theme.COLORS.INPUT_SUCCESS
  },
  error: {
    borderColor: Theme.COLORS.INPUT_ERROR
  },
  primary: {
    borderColor: Theme.COLORS.PRIMARY
  },
  shadow: {
    shadowColor: Theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 1,
    shadowOpacity: 0.13,
    elevation: 2,
  }
});

export default ArInput;
