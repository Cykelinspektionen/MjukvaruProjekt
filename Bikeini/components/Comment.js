import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import serverApi from '../utilities/serverApi';
import { thumbScore, bikeScore } from '../utilities/Const';

const locationIcon = require('../assets/images/location.png');
const thumbUpIcon = require('../assets/images/thumbupNoBack.png');
const thumbDownIcon = require('../assets/images/thumbdownNoBack.png');
const FoundBike = require('../assets/images/FoundBike.png');
const userPlaceholder = require('../assets/images/userPlaceholder.jpg');

const styles = StyleSheet.create({
  item: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    height: 100,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  image: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    marginLeft: '3%',
    backgroundColor: 'blue',
  },
  textView: {
    flex: 1,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: '5%',
    marginLeft: '5%',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
  },
  locationTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    bottom: 6,
  },
  thumbDownTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    bottom: 6,
  },
  thumbUpTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    bottom: 6,
  },
  FoundTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 28,
    height: 27,
    bottom: 6,
  },
  answer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    left: '25%',
    bottom: 4,
  },
  answerText: {
    fontWeight: '700',
  },
  setGreen: {
    backgroundColor: 'green',
  },
  setRed: {
    backgroundColor: 'red',
  },
});

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbDown: false,
      thumbUp: false,
    };
  }

  componentDidMount() {
    const { myId, rating } = this.props;
    rating.up.every(item => (item.userId === myId ? this.setState({ thumbUp: true }) : null));
    rating.down.every(item => (item.userId === myId ? this.setState({ thumbDown: true }) : null));
  }

  sendPointsToUser = (points, type, username) => {
    const { jwt } = this.props;
    const formBody = {};
    formBody.user_name = username;
    formBody[type] = points;
    serverApi.fetchApi('users/updatehighscore/', JSON.stringify(formBody), 'application/json', jwt[0])
      .catch(error => console.log(error));
  }

  setBikeToFound = () => {
    const {
      jwt, bikeId, navigation, refresh, bikeType, bikeSubUsername, username,
    } = this.props;
    const formBody = {
      id: bikeId,
      active: false,
	    type: 'FOUND',
    };
    serverApi.fetchApi('bikes/updatebike/', JSON.stringify(formBody), 'application/json', jwt[0])
      .then(
        this.sendPointsToUser(5, bikeScore, username),
        bikeType === 'FOUND' ? this.sendPointsToUser(5, bikeScore, bikeSubUsername) : null,
        refresh(),
        navigation.navigate('Profile'),

      );
  }

  handleFound = () => {
    Alert.alert(
      'Close Ad',
      'Are you sure you want to close your ad?',
      [
        { text: 'No', onPress: () => console.log('No'), style: 'cancel' },
        { text: 'Yes', onPress: () => { this.setBikeToFound(); console.log('Yes'); } },
      ],
      { cancelable: false },
    );
  }

  sendThumbRating = (value) => {
    const { commentId, jwt } = this.props;
    const formBody = {
      commentId,
      value,
    };
    serverApi.fetchApi('bikes/ratecomment/', JSON.stringify(formBody), 'application/json', jwt[0])
      .catch(error => console.log(error));
  }


  handleThumbs = (action) => {
    const { thumbDown, thumbUp } = this.state;
    const { username } = this.props;
    switch (action) {
      case 'UP':
        this.sendThumbRating('up');
        if (!thumbUp) {
          this.sendPointsToUser(1, thumbScore, username);
        } else if (thumbUp) {
          this.sendPointsToUser(-1, thumbScore, username);
        }
        if (thumbDown) {
          this.sendThumbRating('down');
        }
        this.setState({ thumbUp: !thumbUp, thumbDown: false });
        break;
      case 'DW':
        if (!thumbDown && thumbUp) {
          this.sendThumbRating('up');
          this.sendPointsToUser(-1, thumbScore, username);
        }
        this.sendThumbRating('down');
        this.setState({ thumbDown: !thumbDown, thumbUp: false });
        break;
      default:
        break;
    }
  }

  handleLocation = (location) => {
    const { actions, navigation } = this.props;
    actions.setMarker({ latitude: location.lat, longitude: location.long });
    actions.setShowMarker(true);
    navigation.navigate('PinMap');
  }

  renderButtonSet = () => {
    const {
      showResolveBike, username, ownersComment, location,
    } = this.props;
    const { thumbDown, thumbUp } = this.state;

    let resolveButton = null;
    let positionButton = null;
    let thumbUpButton = null;
    let thumbDwButton = null;

    if (username !== '1' && location.lat && location.long) {
      positionButton = (
        <TouchableOpacity
          style={styles.locationTag}
          onPress={() => this.handleLocation(location)}
        >
          <Image
            style={styles.locationTag}
            source={locationIcon}
          />
        </TouchableOpacity>
      );
    }

    if (!ownersComment) {
      if (showResolveBike && username !== '1') {
        resolveButton = (
          <TouchableOpacity
            style={styles.FoundTag}
            onPress={() => this.handleFound()}
          >
            <Image
              style={styles.FoundTag}
              source={FoundBike}
            />
          </TouchableOpacity>
        );
      }
      if (username !== '1') {
        thumbUpButton = (
          <TouchableOpacity
            style={styles.thumbDownTag}
            onPress={() => this.handleThumbs('DW')}
          >
            <Image
              style={[styles.thumbDownTag, thumbDown ? styles.setRed : []]}
              source={thumbDownIcon}
            />
          </TouchableOpacity>
        );
      }
      if (username !== '1') {
        thumbDwButton = (
          <TouchableOpacity
            style={styles.thumbUpTag}
            onPress={() => this.handleThumbs('UP')}
          >
            <Image
              style={[styles.thumbUpTag, thumbUp ? styles.setGreen : []]}
              source={thumbUpIcon}
            />
          </TouchableOpacity>
        );
      }
    }
    return {
      resolveButton,
      positionButton,
      thumbUpButton,
      thumbDwButton,
    };
  }

  render() {
    const {
      body, username, date, avatarUri,
    } = this.props;
    const dateRaw = date.split('-');
    let day = `${dateRaw[2]}`;
    day = day.split('T');
    const dateClean = `${day[0]}/${dateRaw[1]}`;
    const {
      resolveButton, positionButton, thumbUpButton, thumbDwButton,
    } = this.renderButtonSet();

    return (
      <View style={styles.item}>
        <Image style={styles.image} source={avatarUri.length ? { uri: avatarUri } : userPlaceholder} />
        <View style={styles.textView}>
          <Text>
            {username}
            {', '}
            {dateClean}
          </Text>
          <Text>{' '}</Text>
          <Text style={styles.description}>{body}</Text>
        </View>
        <View style={styles.answer}>
          <Text style={styles.answerText}>Answer</Text>
        </View>
        {positionButton}
        {thumbDwButton}
        {thumbUpButton}
        {resolveButton}
      </View>
    );
  }
}

Comment.propTypes = {
  body: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  jwt: PropTypes.arrayOf(PropTypes.string).isRequired,
  showResolveBike: PropTypes.bool.isRequired,
  bikeId: PropTypes.string.isRequired,
  avatarUri: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
  ownersComment: PropTypes.bool.isRequired,
  bikeSubUsername: PropTypes.string.isRequired,
  bikeType: PropTypes.string.isRequired,
  myId: PropTypes.string.isRequired,
  rating: PropTypes.shape({
    up: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
    down: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  commentId: PropTypes.string.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    setShowMarker: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
  }).isRequired,
};
