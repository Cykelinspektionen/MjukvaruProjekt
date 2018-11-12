import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { login } from '../navigation/actions/LoginActions';
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


class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      jwt: '',
    };

    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);

    this.loadJWT();
  }

  newJWT = (jwt) => {
    this.setState({
      jwt,
    });
  }

  logOutUser = () => {
    this.deleteJWT();
  }

  logInUser = () => {
    { navigation, login } = this.props;
    const jwt = 'auth_token_1';
    login(jwt);
    deviceStorage.saveItem('id_token', jwt);
    navigation.navigate('TempPage');
  }

  render() {
    const { username, password } = this.state;
    const { navigation } = this.props;

    // VERY TEMPORARY TESTING SOLUTION!
    // it looks horrible but it used for testing that storing
    // using AsyncStorage is actually working! :)
    if (this.state.jwt) {
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
            value={username}
            onChangeText={text => this.setState({ username: text })}
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
  const { loginState } = state;
  return { loginState };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    login,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
