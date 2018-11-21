import React from 'react';
import {
  Alert, StyleSheet, Text, View, TextInput, TouchableHighlight, Image,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as authActions from '../navigation/actions/AuthActions';
import serverApi from '../utilities/serverApi';
import deviceStorage from '../utilities/deviceStorage';

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
  inputsError: {
    color: 'red',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
  },
  loginButton: {
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

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: '',
      newEmail: '',
      newPhoneNumber: 0,
      newPassword: '',
      newPasswordConfirm: '',
      clicked: false,
    };
  }

  createNewUser = () => {
    const {
      newUsername, newEmail, newPhoneNumber, newPassword,
    } = this.state;
    const standardLocation = 'Uppsala';
    const userInformation = {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      phone_number: newPhoneNumber,
      location: standardLocation,
    };

    const formBody = this.jsonToFormData(userInformation);

    return serverApi.fetchApi('auth/adduser', formBody, 'application/x-www-form-urlencoded', '')
      .then((responseJson) => {
        const responseErr = this.handleSignUpReponse(responseJson);

        if (responseErr.length === 0) {
          this.authNewUser();
        } else {
          Alert.alert('Username and/or email has to be unique!');
          /*
          for(let i = 0; i < responseErr.length; i += 1) {
            if(responseErr[i] === 'username') {
              credStatus.newUsername = "Username has to be unique!";
            }
            if(responseErr[i] === 'email') {
              credStatus.newEmail = "Email has to be unique!";
            }
          }
          */
        }
      }).catch(error => console.log(error));

    // return credStatus;
  }

  authNewUser = () => {
    const { login, navigation } = this.props;
    const { newEmail, newPassword } = this.state;
    const userInformation = {
      email: newEmail,
      password: newPassword,
    };

    const formBody = this.jsonToFormData(userInformation);

    serverApi.fetchApi('auth', formBody, 'application/x-www-form-urlencoded', '')
      .then((responseJson) => {
        const { token } = responseJson.data;

        deviceStorage.saveItem('id_token', token);
        login([token, '']);
        navigation.navigate('Browser');
      }).catch(error => console.log(error));
  }

  handleSignUpReponse(response) {
    const respErrors = [];
    const { _message, errors } = response;

    if (_message === 'User validation failed') {
      if (errors.hasOwnProperty('email')) {
        respErrors.push('email');
      }
      if (errors.hasOwnProperty('username')) {
        respErrors.push('username');
      }
    }

    return respErrors;
  }

  jsonToFormData(details) {
    let formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join('&');

    return formBody;
  }

  verifyRequiredCredentials(sendToServer) {
    const {
      newUsername, newEmail, newPassword, newPasswordConfirm, clicked,
    } = this.state;
    const credStatus = {
      newUsername: '', newEmail: '', newPassword: '', newPasswordConfirm: '',
    };
    let numErr = 0;
    if (newUsername.trim() === '') {
      credStatus.newUsername = '`Username´ has to be specified';
      numErr += 1;
    }
    if (newEmail.trim() === '') {
      credStatus.newEmail = '`Email´ has to be specified';
      numErr += 1;
    } else if (!newEmail.includes('@')) {
      credStatus.newEmail = '`Email´ has to be a valid email-adress';
      numErr += 1;
    }
    if (newPassword.trim() === '') {
      credStatus.newPassword = '`Password´ has to be specified';
      numErr += 1;
    }
    if (newPasswordConfirm.trim() === '') {
      credStatus.newPasswordConfirm = '`Password´ has to be confirmed';
      numErr += 1;
    }
    if (newPassword !== newPasswordConfirm) {
      credStatus.newPasswordConfirm = '`Password´ has to be matching';
      numErr += 1;
    }

    if (numErr === 0 && sendToServer) {
      this.createNewUser();
    }

    if (!clicked) {
      this.setState({ clicked: true });
    }
    return credStatus;
  }

  render() {
    const {
      username, email, phoneNumber, password, clicked,
    } = this.state;
    let credStatus = {};
    if (clicked) {
      credStatus = this.verifyRequiredCredentials(false);
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
            placeholder="Username"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ newUsername: text })}
          />
        </View>
        {!!clicked && credStatus.newUsername !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newUsername}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            value={email}
            onChangeText={text => this.setState({ newEmail: text })}
          />
        </View>
        {!!clicked && credStatus.newEmail !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newEmail}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Phone number"
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            value={phoneNumber}
            onChangeText={text => this.setState({ newPhoneNumber: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            value={password}
            onChangeText={text => this.setState({ newPassword: text })}
          />
        </View>
        {!!clicked && credStatus.newPassword !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newPassword}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Confirm Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            value={password}
            onChangeText={text => this.setState({ newPasswordConfirm: text })}
          />
        </View>
        {!!clicked && credStatus.newPasswordConfirm !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newPasswordConfirm}</Text>
        )}
        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this.verifyRequiredCredentials(true)}
        >
          <Text style={styles.loginText}>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  login: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const { signUpState, authState } = state;
  return { signUpState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...authActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
