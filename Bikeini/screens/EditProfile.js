import React from 'react';
import {
  ImageBackground, StyleSheet, Text, View, TextInput, TouchableHighlight, KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { headerBackStyle } from './header';
import * as profileActions from '../navigation/actions/ProfileActions';

const background = require('../assets/images/background.jpeg');

const styles = StyleSheet.create({

  /*
  background: {
    backgroundColor: 'transparent',
   / flex: 1,
  },
  */

  backImg: {
    width: '100%',
    height: '100%',
    flex: 1,
    // alignSelf: 'stretch',
  },
  container: {
    // flex: 1,
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // backgroundColor: 'transparent',
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'transparent',
    margin: 20,
    padding: 30,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 2,
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
    backgroundColor: 'white',
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
  locationText: {
    backgroundColor: 'white',
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 18,
  },
});


class EditProfile extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      newPassword2: '',
    };
  }

  componentDidUpdate() {
    /*
    const { resetState, navigation, requestNewPasswordReset } = this.props;
    if (!resetState.loadingReset && resetState.passwordResetDone && resetState.error === '') {
      navigation.navigate('Login');
      requestNewPasswordReset();
    }
    */
  }
  /*
  getErrorMessage(error) {
    return error;
  }
  */

 changePassword = () => {
   console.log('lol');
 }

  updateProfile = () => {
    // const { emailOrUserName } = this.state;
    // const { requestNewPasswordInit } = this.props;
    // requestNewPasswordInit(emailOrUserName);
  }

  render() {
    const { profileState } = this.props;
    const { location, email, username } = profileState;
    const { newPassword, newPassword2 } = this.state;

    /*
    if (resetState.loadingReset) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );

    }
    */
    return (
      <ImageBackground style={styles.backImg} source={background}>
         <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
          {/* <View style={styles.background}> */}
            {/* <View style={styles.container}> */}
              <Text style={styles.locationText}>
                {'Current Location: '}
                { location }
                {' '}
              </Text>
              <TouchableHighlight
                style={[styles.buttonContainer, styles.requestButton]}
                onPress={() => this.requestNewPassword()}
              >
                <Text style={styles.loginText}>Change Location</Text>
              </TouchableHighlight>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputs}
                  placeholder="New password"
                  underlineColorAndroid="transparent"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={text => this.setState({ newPassword: text })}
                />
              </View>
              <Text style={{ color: 'red' }}>
                { profileState.error ? profileState.error : ''}
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputs}
                  placeholder="Repeat new password"
                  underlineColorAndroid="transparent"
                  secureTextEntry
                  value={newPassword2}
                  onChangeText={text => this.setState({ newPassword2: text })}
                />
              </View>
              <Text style={{ color: 'red' }}>
                { profileState.error ? profileState.error : ''}
              </Text>
              <TouchableHighlight
                style={[styles.buttonContainer, styles.requestButton]}
                onPress={() => this.changePassword()}
              >
                <Text style={styles.loginText}>Change password</Text>
              </TouchableHighlight>
            {/* </View> */}
          {/* </View> */}
        </KeyboardAvoidingView>
      </ImageBackground>
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
};


const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...profileActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
