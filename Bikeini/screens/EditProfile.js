import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Image, KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { headerBackStyle } from './header';

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


class EditProfile extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      emailOrUserName: '',
    };
  }

  componentDidUpdate() {
    const { resetState, navigation, requestNewPasswordReset } = this.props;
    if (!resetState.loadingReset && resetState.passwordResetDone && resetState.error === '') {
      navigation.navigate('Login');
      requestNewPasswordReset();
    }
  }
  /*
  getErrorMessage(error) {
    return error;
  }
  */

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
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
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
        <Text style={{ color: 'red' }}>
          { resetState.error ? resetState.error : ''}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Location"
            underlineColorAndroid="transparent"
            value={emailOrUserName}
            onChangeText={text => this.setState({ emailOrUserName: text })}
          />
        </View>
        <Text style={{ color: 'red' }}>
          { resetState.error ? resetState.error : ''}
        </Text>
        <TouchableHighlight
          style={[styles.buttonContainer, styles.requestButton]}
          onPress={() => this.requestNewPassword()}
        >
          <Text style={styles.loginText}>Edit</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>

    );
  }
}

EditProfile.propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    authState: PropTypes.shape({
      isLoggedIn: PropTypes.bool.isRequired,
      username: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      jwt: PropTypes.array.isRequired,
    }).isRequired,
    profileState: PropTypes.shape({
      imgToUploadUri: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone_number: PropTypes.number.isRequired,
      create_time: PropTypes.string.isRequired,
      avatarUri: PropTypes.shape({
        img: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
      }).isRequired,
      game_score: PropTypes.shape({
        bike_score: PropTypes.number.isRequired,
        bikes_lost: PropTypes.number.isRequired,
        thumb_score: PropTypes.number.isRequired,
        total_score: PropTypes.number.isRequired,
      }).isRequired,
      loadingProfile: PropTypes.bool.isRequired,
      profileLoaded: PropTypes.bool.isRequired,
      error: PropTypes.string.isRequired,
    }).isRequired,
    uploadProfilePicToServer: PropTypes.func.isRequired,
    deleteJWTInit: PropTypes.func.isRequired,
    unloadProfile: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
    setShowMarker: PropTypes.func.isRequired,
  };


const mapStateToProps = (state) => {
  const { resetState } = state;
  return { resetState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...ResetPasswordActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
