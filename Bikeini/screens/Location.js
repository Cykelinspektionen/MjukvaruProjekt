import React from 'react';
import {
  StyleSheet, View, Text, Image, FlatList, TouchableHighlight,
} from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { CheckBox } from 'react-native-elements';
import * as cities from '../assets/Cities';

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

let checkedFlag = false;
let checkedCity = '';

class Location extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      location: '',
    };
  }

checkItem = (item) => {
  const { checked, location } = this.state;
  if (!checked.includes(item) && checkedFlag !== true) {
    this.setState({ checked: [...checked, item], location: item });
    checkedFlag = true;
    checkedCity = item;
  } else if (checkedCity === item) {
    this.setState({ checked: checked.filter(a => a !== item) });
    checkedFlag = false;
    checkedCity = '';
  } else {
    this.setState({ checked: checked.filter(a => a !== item) });
  }
};


render() {
  const { checked } = this.state;
  const city = cities.cities;
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/images/biker.png')} />
      <Text style={styles.heading}>SELECT CITY</Text>
      <FlatList
        style={styles.city}
        data={city}
        extraData={this.state}
        renderItem={({ item }) => (
          <CheckBox
            title={item}
            onPress={() => this.checkItem(item)}
            checked={checked.includes(item)}
          />
        )}
      />
      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.logOutUser}>
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
  //location: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { locationState } = state;
  return { locationState };
};

/* const mapDispatchToProps = dispatch => (
  bindActionCreators({
    location,
  }, dispatch)
); */

export default connect(mapStateToProps /* , mapDispatchToProps */)(Location);
