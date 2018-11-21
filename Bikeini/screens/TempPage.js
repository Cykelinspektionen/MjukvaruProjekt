import React from 'react';
import {
  StyleSheet, Text, View, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as authActions from '../navigation/actions/AuthActions';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class TempPage extends React.PureComponent {
  render() {
    const { deleteJWTInit } = this.props;
    return (
      <View style={styles.container}>
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={deleteJWTInit}>
          <Text style={styles.loginText}>DeleteJWT</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

TempPage.propTypes = {
  deleteJWTInit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { profileState, authState } = state;
  return { profileState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...authActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(TempPage);
