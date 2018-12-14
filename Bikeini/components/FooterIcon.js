import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as profileActions from '../navigation/actions/ProfileActions';

class FooterIcon extends React.Component {
  constructor() {
    super();
    this.state = {
      notification: false,
    }
  }

  componentDidMount() {
    const { profileState } = this.props;
    const { profileNotification } = profileState;

    this.setState({
      notification: profileNotification,
    })
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.profileState.profileNotification) !== JSON.stringify(nextProps.profileState.profileNotification)) // Check if it's a new user, you can also use some unique property, like the ID
    {
      this.setState({notification: nextProps.profileState.profileNotification});
    }
}

  render() {
    const { notification } = this.state;
    if(notification) {
      return (
        <View style={{position: 'absolute', right: 1, top: 1, backgroundColor: 'red', width: 7, height: 7, borderRadius: 9}}></View>
      );
    }
    else {
      return (
        null
      );
    }
  }
}

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...profileActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(FooterIcon);
