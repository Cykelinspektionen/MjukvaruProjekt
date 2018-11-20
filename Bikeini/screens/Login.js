import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Alert,
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


class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };

    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();
  }

  logInUser = () => {
    const { email, password } = this.state;
    const { navigation, login } = this.props;
    // navigation.navigate('Browser');
    serverApi.fetchApi('auth/', {
      email,
      password,
    }, 'application/json')
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.error) {
          Alert.alert(responseJson.message);
          return;
          // TODO: Show failure to user better!
        } if (responseJson.status === 'success') {
          // deviceStorage.saveItem('id_token', responseJson.token);
          console.log(responseJson);
          // login(responseJson.token);
          // console.log(this.props.authState);
        } else {
          Alert.alert('Unknown failure');
        }
        // Check for failure!
        // navigation.navigate('TempPage'); */
      }).catch(error => console.log(error));
  }

  logOutUser = () => {
    this.deleteJWT();
    authActions.logout();
  }

  render() {
    const { email, password } = this.state;
    const { navigation, authState } = this.props;

    // VERY TEMPORARY TESTING SOLUTION!
    // it looks horrible but it used for testing that storing
    // using AsyncStorage is actually working! :)
    if (authState.jwt.length) {
      return (
        <View style={styles.container}>
          <Text> Already logged in fam </Text>
          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.logOutUser}>
            <Text style={styles.loginText}>Log me out fam</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text>
                Welcome to Bikeini lalalal
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            value={email}
            onChangeText={text => this.setState({ email: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            value={password}
            onChangeText={text => this.setState({ password: text })}
          />
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.logInUser}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.loginText}>Sign up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState } = state;
  return { authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...authActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
