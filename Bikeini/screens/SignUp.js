import React from 'react';
import {
  Alert, StyleSheet, Text, View, TextInput, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as authActions from '../navigation/actions/AuthActions';
import serverApi from '../utilities/serverApi';
import deviceStorage from '../utilities/deviceStorage';

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
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
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
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#00b5ec',
  },
  loginText: {
    color: 'white',
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
    };
  }

  jsonToFormData(details) {
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return formBody;
  }

  createNewUser = () => {
    const { newUsername, newEmail, newPhoneNumber, newPassword } = this.state;
    const standardLocation = 'Uppsala'; 
    const userInformation = {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      phone_number: newPhoneNumber,
      location: standardLocation
    };

    var formBody = this.jsonToFormData(userInformation);

    serverApi.fetchApi('auth/adduser', formBody, 'application/x-www-form-urlencoded', '')
      .then((responseJson) => {
        // Check for failure!
        console.log(responseJson);
        /*
        deviceStorage.saveItem('id_token', responseJson.jwt);
        const { jwt } = responseJson.jwt;
        login(jwt);
        navigation.navigate('Location');
        */
        this.authNewUser();
      }).catch(error => console.log(error));
  }

  authNewUser = () => {
    const { login, navigation } = this.props;
    const { newEmail, newPassword } = this.state;
    const userInformation = {
      email: newEmail,
      password: newPassword
    };

    var formBody = this.jsonToFormData(userInformation);

    serverApi.fetchApi('auth', formBody, 'application/x-www-form-urlencoded', '')
      .then((responseJson) => {
        const { token } = responseJson.data;
        console.log(token);

        deviceStorage.saveItem('id_token', token);
        login([token, '']);
        navigation.navigate('Browser');
      }).catch(error => console.log(error));
  }

  handleSignUp = () => {
    switch (this.verifyRequiredCredentials()) {
      case 'emptyField':
        Alert.alert('All fields must not be empty');
        break;
      case 'missMatch':
        Alert.alert('Passwords must match');
        break;
      case 'invalidEmail':
        Alert.alert('Email is invalid (missing @)');
        break;
      case 'approved':
        this.createNewUser();
        break;
      default:
        break;
    }
  }

  verifyRequiredCredentials = () => {
    const { newUsername, newPassword, newPasswordConfirm } = this.state;
    if (newUsername.trim() === '' || newPassword.trim() === '' || newPasswordConfirm.trim() === '') return 'emptyField';
    if (newPassword !== newPasswordConfirm) return 'missMatch';
    return 'approved';
  }

  render() {
    const { username, email, phoneNumber, password } = this.state;
    return (
      <View style={styles.container}>
        <Text>FILL IN YOUR SHIT!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Username"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ newUsername: text })}
          />
        </View>
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

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={this.handleSignUp}
        >
          <Text style={styles.loginText}>Sign up</Text>
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
