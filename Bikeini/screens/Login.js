import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as authActions from '../navigation/actions/AuthActions';
import * as profileActions from '../navigation/actions/ProfileActions';
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
  }


  componentDidMount() {
    const { loadJWTInit } = this.props;
    loadJWTInit();
  }

  componentDidUpdate() {
    const { authState, profileState } = this.props;
    if (!authState.loadingJwt && authState.jwt[0] && !profileState.profileLoaded && !profileState.loadingProfile && !profileState.error) {
      const { loadProfileInit } = this.props;
      console.log('jwt to send:', authState.jwt[0]);
      loadProfileInit(authState.jwt[0]);
    } else if (profileState.error) {
      console.log(profileState.errorMsg);
    }
  }

  logInUser = () => {
    const { email, password } = this.state;
    const { navigation, login, setLocation } = this.props;
    // navigation.navigate('Browser');
    serverApi.fetchApi('auth/', {
      email,
      password,
    }, 'application/json')
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.error) {
          Alert.alert(responseJson.message);
          // TODO: Show failure to user better!
        } else if (responseJson.status === 'success') {
          deviceStorage.saveItem('id_token', responseJson.data.token);
          login(responseJson.data.token);
          if (responseJson.data.user.location) {
            setLocation(responseJson.data.user.location);
            navigation.navigate('Browser');
          } else {
            navigation.navigate('Location');
          }
        } else {
          Alert.alert('Unknown failure');
        }
      }).catch(error => console.log(error));
  }

  logOutUser = () => {
    this.deleteJWT();
    authActions.logout();
  }

  getUserData = () => {
    const { jwt } = this.state;
    const { navigation } = this.props;
    serverApi.get('users/getuserinfo/', jwt)
      .then((responseJson) => {
        console.log(responseJson);
        profileActions.setProfile(responseJson);
        if (responseJson.location) {
          navigation.navigate('Browser');
        } else {
          navigation.navigate('Location');
        }
      }).catch(error => console.log(error));
  }

  render() {
    const { email, password, jwt } = this.state;
    const { navigation, authState, profileState } = this.props;

    // VERY TEMPORARY TESTING SOLUTION!
    // it looks horrible but it used for testing that storing
    // using AsyncStorage is actually working! :)
    /*
    console.log(authState, this.state);
    if (jwt) {
      console.log('test');
      // this.getUserData();
    }
*/
    if (authState.loadingJwt) {
      console.log('loading jwt');
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!authState.loadingJwt && authState.jwt[0] && profileState.loadingProfile) {
      console.log('loading profile', profileState);
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!authState.loadingJwt && authState.jwt[0] && !profileState.profileLoaded && !profileState.loadingProfile) {
      console.log('loaded jwt, initi load profile', profileState);
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (profileState.profileLoaded) {
      console.log('Done');
      return (
        <View>
          <Text>DONE...</Text>
        </View>
      );
    }
    console.log(authState, profileState);
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
  setLocation: PropTypes.func.isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
  loadJWTInit: PropTypes.func.isRequired,
  loadProfileInit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...authActions, ...profileActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
