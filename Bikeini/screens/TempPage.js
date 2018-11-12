/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { connect } from 'react-redux';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class TempPage extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          {this.props.loginState.jwt}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { loginState } = state;
  return { loginState };
};

export default connect(mapStateToProps)(TempPage);
