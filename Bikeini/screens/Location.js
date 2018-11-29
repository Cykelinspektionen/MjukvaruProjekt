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

class Location extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: '',
    };
  }

checkItem = (item) => {
  const { checked } = this.state;
  if (checked !== item) {
    this.setState({ checked: item });
  } else if (checked === item) {
    this.setState({ checked: '' });
  }
};

sendLocationToServer = () => {
  const { checked } = this.state;
  if (!checked.length) {
    // TODO: MUst select city
    return;
  }
  const { authState, setLocation } = this.props;
  const body = JSON.stringify({ location: checked });
  serverApi.fetchApi('users/updateuser/', body, 'application/json', authState.jwt[0]);
  setLocation(checked);
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
  profileState: PropTypes.shape({
    location: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.number.isRequired,
    create_time: PropTypes.string.isRequired,
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
