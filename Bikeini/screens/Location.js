import React from 'react';
import {
  StyleSheet, View, Text, Image, FlatList, TouchableHighlight,
} from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { CheckBox } from 'react-native-elements';
import cities from '../assets/Cities';
import * as profileActions from '../navigation/actions/ProfileActions';
import serverApi from '../utilities/serverApi';

const logo = require('../assets/images/biker.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },

  buttonContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    width: 150,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#44ccad',
  },
  loginText: {
    color: 'white',
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 35,
    fontWeight: 'bold',
  },
  city: {
    width: 400,
  },
  logo: {
    height: 100,
    width: 100,
  },
});

let checkedCity = '';

class Location extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: [],
    };
  }

checkItem = (item) => {
  const { setLocation } = this.props;
  const { checked } = this.state;
  if (!checked.includes(item)) {
    this.setState({ checked: [item] });
    checkedCity = item;
  } else if (checkedCity === item) {
    this.setState({ checked: checked.filter(a => a !== item) });
    checkedCity = '';
  } else {
    this.setState({ checked: checked.filter(a => a !== item) });
  }
  setLocation(item);
};

sendLocationToServer = () => {
  const { setLocation, authState } = this.props;
  serverApi.fetchApi('setLocation', setLocation, 'multipart/form-data', authState.jwt[0]);
}

render() {
  const { checked } = this.state;
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <Text style={styles.heading}>SELECT CITY</Text>
      <FlatList
        style={styles.city}
        data={cities}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        renderItem={({ item }) => (
          <CheckBox
            title={item}
            onPress={() => this.checkItem(item)}
            checked={checked.includes(item)}
          />
        )}
      />
      <TouchableHighlight
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={() => {
          this.sendLocationToServer();
          // navigation.navigate(this.logOutUser);
        }}
      >
        <Text style={styles.loginText}>Submit</Text>
      </TouchableHighlight>
    </View>
  );
}
}


Location.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  setLocation: PropTypes.func.isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { profileState, authState } = state;
  return { profileState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...profileActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Location);
