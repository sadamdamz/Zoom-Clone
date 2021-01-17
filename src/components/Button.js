import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'galio-framework';

class ArButton extends React.Component {
  render() {
    const { small, shadowless, children, color, style, fontSize, round, ...props } = this.props;

    return (
      <Button
        style={style}
        shadowless
        textStyle={{ fontSize: fontSize || 12, fontWeight: '700' }}
        {...props}
      >
        {children}
      </Button>
    );
  }
}

ArButton.propTypes = {
  small: PropTypes.bool,
  shadowless: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'default',
      'primary',
      'info',
      'error',
      'success',
      'warning',
      'simple',
      'neutral'
    ])
  ])
};

const styles = StyleSheet.create({
  smallButton: {
    width: 75,
    height: 28
  }
});

export default ArButton;
