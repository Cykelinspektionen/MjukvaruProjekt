import React from 'react';
import {
  ScrollView, ImageBackground, StyleSheet, Text, View, TextInput, TouchableHighlight, KeyboardAvoidingView,
} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { headerBackStyle } from './header';
import * as profileActions from '../navigation/actions/ProfileActions';
import * as authActions from '../navigation/actions/AuthActions';


const background = require('../assets/images/background.jpeg');

const styles = StyleSheet.create({


  background: {
    margin: 20,
    padding: 30,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
  },

  outerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  backImg: {
    // width: '100%',
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // alignSelf: 'stretch',
  },
  container: {
    // flex: 1,
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // backgroundColor: 'transparent',
    // alignItems: 'flex-start',
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
    height: 45,
    width: 250,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  requestButton: {
    // width: '90%',
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 35,
    backgroundColor: '#74C3AE',
  },
  removeButton: {
    alignItems: 'center',

    marginTop: 35,
    backgroundColor: '#e2715a',
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

const passLowCase = 'abcdefghijklmnopqrstuvwxyz';
const passUpCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const passNumbs = '1234567890';
const passChars = ' !"#$%&()*+,-./:;<=>?@[\]^_`{|}~';

class EditProfile extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      newPassword2: '',
      credStatus: {},
    };
  }

  componentDidMount() {
    const { updateReset } = this.props;
    updateReset();
  }

  componentDidUpdate() {
    const { authState, navigation } = this.props;
    const { deleteUser } = authState;
    if (deleteUser.userdeleted) {
      navigation.navigate('Login');
    }
  }

  checkPasswordStrength = () => {
    const { newPassword } = this.state;

    if (newPassword.length < 8) {
      return '`Password´ has to be ATLEAST 8 characters!';
    }

    const conditions = {
      specialChar: false, number: false, lowerCase: false, upperCase: false,
    };
    for (let i = 0; i < newPassword.length; i += 1) {
      const currChar = newPassword.charAt(i);

      if (passChars.indexOf(currChar) > -1) {
        conditions.specialChar = true;
      } else if (passNumbs.indexOf(currChar) > -1) {
        conditions.number = true;
      } else if (passLowCase.indexOf(currChar) > -1) {
        conditions.lowerCase = true;
      } else if (passUpCase.indexOf(currChar) > -1) {
        conditions.upperCase = true;
      }

      if (conditions.specialChar && conditions.number
          && conditions.lowerCase && conditions.upperCase) {
        return '';
      }
    }

    let errorMsg = 'Missing';
    if (!conditions.specialChar) {
      errorMsg += ', `SPECIAL CHARACTER´';
    }
    if (!conditions.number) {
      errorMsg += ', `NUMBER´';
    }
    if (!conditions.lowerCase) {
      errorMsg += ', `LOWERCASE LETTER´';
    }
    if (!conditions.upperCase) {
      errorMsg += ', `UPPERCASE LETTER´';
    }
    return errorMsg;
  }


  changePassword = () => {
    const {
      newPassword, newPassword2,
    } = this.state;
    let numErr = 0;
    const credStatus = {
      newPassword: '', newPassword2: '',
    };

    credStatus.newPassword = this.checkPasswordStrength();
    if (credStatus.newPassword !== '') {
      numErr += 1;
    }

    if (newPassword !== newPassword2) {
      credStatus.newPassword2 = '`Password´ has to be matching';
      numErr += 1;
    }

    if (newPassword.trim() === '') {
      credStatus.newPassword = '`Password´ has to be specified';
      numErr += 1;
    }
    this.setState({ credStatus });
    if (numErr === 0) {
      this.updateProfile();
    } else {
      const { updateReset } = this.props;
      updateReset();
    }
  }

  updateProfile = () => {
    const { newPassword } = this.state;
    const { updateUserInit, authState } = this.props;

    const newUser = {
      password: newPassword,
    };
    updateUserInit(newUser, authState.jwt[0]);
  }

  changeLocation = () => {
    const { navigation } = this.props;
    navigation.navigate('Location');
  }

  deleteUser = () => {
    const { profileState, deleteUserInit, authState } = this.props;
    deleteUserInit(profileState.email, null);
    deleteUserInit(profileState.email, authState.jwt[0]);
  }

  render() {
    const { profileState, authState } = this.props;
    const { newPassword, newPassword2, credStatus } = this.state;
    const { location } = profileState;
    const { deleteUser } = authState;


    const { updateProfile } = profileState;
    let success = '';
    if (!updateProfile.loadingUpdate && updateProfile.updateDone && updateProfile.error === '') {
      success = 'Password succesfully changed';
    }

    if (profileState.loadingUpdate || deleteUser.deletingUser) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (

      <ImageBackground style={styles.backImg} source={background}>
            <KeyboardAvoidingView behavior="padding" style={styles.background} enabled> 


        {/* <KeyboardAvoidingView keyboardVerticalOffset={500}  enabled style={styles.container}> */}
        {/* <ScrollView style={styles.container}> */}
          {/* <View style={styles.background}> */}
          {/* <View style={styles.container}> */}
          <Text style={styles.locationText}>
            {'Current Location: '}
            { location }
            {' '}
          </Text>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.requestButton]}
            onPress={() => this.changeLocation()}
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
          <Text style={{ color: 'red' }}>{credStatus.newPassword}</Text>
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
          <Text style={{ color: 'red' }}>{credStatus.newPassword2}</Text>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.requestButton]}
            onPress={() => this.changePassword()}
          >
            <Text style={styles.loginText}>Change password</Text>
          </TouchableHighlight>
          <Text style={{ color: 'blue' }}>{success}</Text>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.removeButton]}
            onPress={() => this.deleteUser()}
          >
            <Text style={styles.loginText}>Remove Account</Text>
          </TouchableHighlight>

          {/* </View> */}
          {/* </View> */}
          {/* </ScrollView> */}
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
  updateUserInit: PropTypes.func.isRequired,
  updateReset: PropTypes.func.isRequired,
  deleteUserInit: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...profileActions, ...authActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
