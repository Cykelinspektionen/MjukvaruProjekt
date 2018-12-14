import React from 'react';
import {
  View, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TabBarIcon from '../assets/TabBarIcon';

import * as profileActions from '../navigation/actions/ProfileActions';
import { setHoldNotification } from '../navigation/actions/RouteActions';

class FooterIcon extends React.Component {
  constructor() {
    super();
    this.state = {
      notification: false,
      timer: null,
    };
  }

  componentDidMount() {
    const { profileState } = this.props;
    const { profileNotification } = profileState;
    const { timer } = this.state;

    /*
      https://github.com/erikras/react-redux-universal-hot-example/issues/429,
      ^^^                                                                 ^^^
              setInterval is called twice but running without devmode
              should fix this bug! Functionality is still working
              as it should but it send x2 as many requests :/
    */
    clearInterval(timer);
    this.setState({
      notification: profileNotification,
      timer: setInterval(() => {
        // Only check with server if the user is NOT in the Profile-screen.
        this.checkIfNotification();
      }, 10000),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { profileState } = this.props;
    const { profileNotification } = profileState;

    if (profileNotification !== nextProps.profileState.profileNotification) {
      if (profileNotification) {
        this.setState({ notification: false });
      } else {
        this.setState({ notification: true });
      }
    }
  }

  checkIfNotification = () => {
    const { setNotifiction, routeState } = this.props;
    const { holdNotification } = routeState;
    if (!holdNotification) {
      setNotifiction();
    }
  }

  render() {
    const { notification } = this.state;
    const { focused } = this.props;
    return (
      <View>
        <TabBarIcon
          focused={focused}
          name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
        />
        {notification ? (
          <View style={{
            position: 'absolute', right: 1, top: 1, backgroundColor: 'red', width: 7, height: 7, borderRadius: 9,
          }}
          />
        ) : null }
      </View>
    );
  }
}

FooterIcon.propTypes = {
  profileState: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
    profileNotification: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
  routeState: PropTypes.shape({
    activeRoute: PropTypes.string.isRequired,
  }).isRequired,
  setNotifiction: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { profileState, routeState } = state;
  return { profileState, routeState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { setHoldNotification, ...profileActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(FooterIcon);
