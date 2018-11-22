import React from 'react';
import {
  StyleSheet, Text, View, Image
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as jwtActions from '../navigation/actions/JwtActions';

const stockBicycle = require('../assets/images/stockBicycle.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
});

class BikeInformation extends React.Component {

  render() {
    const { id } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={stockBicycle} />
        <Text style={styles.loginText}>{id}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { profileState, authState } = state;
  return { profileState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...jwtActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(BikeInformation);
