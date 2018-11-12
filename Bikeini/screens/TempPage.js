import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


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
    // This is so weird, following is considered correct according to ESlint running airbnb, why?
    const { loginState } = this.props;
    const { jwt } = loginState;
    return (
      <View style={styles.container}>
        <Text>
          {jwt}
        </Text>
      </View>
    );
  }
}

TempPage.propTypes = {
  loginState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { loginState } = state;
  return { loginState };
};

export default connect(mapStateToProps)(TempPage);
