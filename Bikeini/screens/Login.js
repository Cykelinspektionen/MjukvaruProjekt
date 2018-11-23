import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as authActions from '../navigation/actions/AuthActions';
import * as profileActions from '../navigation/actions/ProfileActions';
import * as jwtActions from '../navigation/actions/JwtActions';


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
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
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
  }

  componentDidMount() {
    const { loadJWTInit } = this.props;
    loadJWTInit();
  }

  componentDidUpdate() {
    const {
      authState, profileState, navigation, loadProfileInit,
    } = this.props;
    // console.log(profileState, authState);

    if (
      !authState.loadingJwt
      && authState.jwt[0]
      && !profileState.profileLoaded
      && !profileState.loadingProfile
      && !profileState.error
      && !authState.isLoggedIn
      && !authState.deletingJwt
      && !authState.error) {
      // console.log('LOADING PROFILE');
      loadProfileInit(authState.jwt[0]);
    } else if (profileState.profileLoaded && profileState.location.length) {
      navigation.navigate('Browser');
    } else if (profileState.profileLoaded && !profileState.location.length) {
      navigation.navigate('Location');
    }
    return 'did update'; // what to return?
  }

  logInUser = () => {
    const { email, password } = this.state;
    const { loginInit } = this.props;
    loginInit(email, password);
  }

  render() {
    const { email, password } = this.state;
    const { navigation, authState, profileState } = this.props;
    if (authState.loadingJwt || profileState.loadingProfile || authState.authorizing) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text>
                Welcome to Bikeini
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

        <TouchableHighlight style={[styles.buttonContainer, styles.greenButton]} onPress={this.logInUser}>
          <Text style={styles.greenButtonText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.buttonContainer, styles.greenButton]} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.greenButtonText}>Sign up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

Login.propTypes = {
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
    location: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.number.isRequired,
    create_time: PropTypes.string.isRequired,
    game_score: PropTypes.number.isRequired,
    loadingProfile: PropTypes.bool.isRequired,
    profileLoaded: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
  loadJWTInit: PropTypes.func.isRequired,
  loadProfileInit: PropTypes.func.isRequired,
  loginInit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...authActions, ...profileActions, ...jwtActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
