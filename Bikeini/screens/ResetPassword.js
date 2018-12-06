import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Image,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import * as ResetPasswordActions from '../navigation/actions/ResetPasswordActions';

const logo = require('../assets/images/biker.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 35,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 35,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
  },
  requestButton: {
    marginTop: 35,
    backgroundColor: '#74C3AE',
  },
  loginText: {
    color: 'white',
  },
  logo: {
    height: 100,
    width: 100,
  },
  logoTextCont: {
    marginTop: 5,
  },
  logoText: {
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 14,
  },
});


class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailOrUserName: '',
    };
  }

  componentDidUpdate() {
    const { resetState, navigation } = this.props;
    if (!resetState.loadingReset && resetState.passwordResetDone && !resetState.error) {
      navigation.navigate('Login');
    }
  }

  requestNewPassword = () => {
    const { emailOrUserName } = this.state;
    const { requestNewPasswordInit } = this.props;
    requestNewPasswordInit(emailOrUserName);
  }

  render() {
    const { emailOrUserName } = this.state;
    const { resetState } = this.props;
    if (resetState.loadingReset) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <View style={styles.logoTextCont}>
          <Text style={styles.logoText}> Cykelinspektionen </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Username or Email"
            underlineColorAndroid="transparent"
            value={emailOrUserName}
            onChangeText={text => this.setState({ emailOrUserName: text })}
          />
        </View>
        <Text style={{ color: 'red' }}>{resetState.error}</Text>
        <TouchableHighlight
          style={[styles.buttonContainer, styles.requestButton]}
          onPress={() => this.requestNewPassword()}
        >
          <Text style={styles.loginText}>Request new password</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

ResetPassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  resetState: PropTypes.shape({
    loadingReset: PropTypes.bool.isRequired,
    passwordResetDone: PropTypes.bool.isRequired,
  }).isRequired,
  requestNewPasswordInit: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const { resetState } = state;
  return { resetState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...ResetPasswordActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
