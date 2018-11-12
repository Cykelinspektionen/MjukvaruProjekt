import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
    const { username, password } = this.state;
    serverApi.fetchApi('sign_up', {
      username,
      password,
    })
      .then((responseJson) => {
        console.log(responseJson);
        deviceStorage.saveItem('id_token', responseJson.jwt);
        // let jwt = responseJson.jwt;
        // this.props.login(jwt);
      }).catch(error => console.log(error));
  }

  render() {
    const { username, password } = this.state;
    const { navigation } = this.props;
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
          onPress={() => navigation.navigate('TempPage')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={this.createNewUser}
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
};

const mapStateToProps = (state) => {
  const { loginState } = state;
  return { loginState };
};

export default connect(mapStateToProps)(SignUp);
