import React from 'react';
import {
  Alert, StyleSheet, Text, View, TextInput, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { login } from '../navigation/actions/AuthActions';
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

class SignUp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: '',
      newPassword: '',
      newPasswordConfirm: '',
    };
  }

  createNewUser = () => {
    const { newUsername, newPassword, navigation } = this.state;
    const { login } = this.props;
    serverApi.fetchApi('sign_up', {
      newUsername,
      newPassword,
    })
      .then((responseJson) => {
        // Check for failure!
        console.log(responseJson);
        deviceStorage.saveItem('id_token', responseJson.jwt);
        navigation.navigate('TempPage');
        const { jwt } = responseJson.jwt;
        login(jwt);
        navigation.navigate('TempPage');
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
    const { username, password } = this.state;
    return (
      <View style={styles.container}>
        <Text>FILL IN YOUR SHIT!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ newUsername: text })}
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
  const { signUpState } = state;
  return { signUpState };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    login,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
