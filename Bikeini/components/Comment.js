import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import serverApi from '../utilities/serverApi';

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

const thumbScore = 'thumb_score';
const bikeScore = 'bike_score';

export default class Comment extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      thumbDown: false,
      thumbUp: false,
    };
  }

  sendPointsToUser = (points, type) => {
    const { author, jwt } = this.props;
    const formBody = {
      author,
      points,
      type,
    };
    serverApi.fetchApi('users/updatescore/', JSON.stringify(formBody), 'application/json', jwt[0]);
  }

  setBikeToFound = () => {
    const { jwt, bikeId } = this.props;
    const formBody = {
      bikeId,
      active: false,
	    type: 'Found',

    };
    serverApi.fetchApi(null, JSON.stringify(formBody), 'application/json', jwt[0])
      .then(this.sendPointsToUser(5, bikeScore));
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

  handleThumbs = (action) => {
    const { thumbDown, thumbUp } = this.state;
    switch (action) {
      case 'UP':
        if (!thumbUp) {
          this.sendThumbPointsToUser(1, thumbScore);
        } else if (thumbUp) {
          this.sendThumbPointsToUser(-1, thumbScore);
        }
        this.setState({ thumbUp: !thumbUp, thumbDown: false });
        break;
      case 'DW':
        if (!thumbDown && thumbUp) {
          this.sendThumbPointsToUser(-1, thumbScore);
        }
        this.setState({ thumbDown: !thumbDown, thumbUp: false });
        break;
      default:
        break;
    }
  }

  renderButtonSet = () => {
    const { showResolveBike, author } = this.props;
    const { thumbDown, thumbUp } = this.state;

    let resolveButton = null;
    let positionButton = null;
    let thumbUpButton = null;
    let thumbDwButton = null;
    if (showResolveBike && author !== 1) {
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
    if (author !== '1') {
      positionButton = (
        <TouchableOpacity
          style={styles.locationTag}
          onPress={() => Alert.alert('Do something!')}
        >
          <Image
            style={styles.locationTag}
            source={locationIcon}
          />
        </TouchableOpacity>
      );
    }

    if (author !== '1') {
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
    if (author !== '1') {
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

    return {
      resolveButton,
      positionButton,
      thumbUpButton,
      thumbDwButton,
    };
  }

  render() {
    const {
      body, author, date,
    } = this.props;
    const dateRaw = date.split('-');
    let day = `${dateRaw[2]}`;
    day = day.split('T');
    const dateClean = `${day[0]}/${dateRaw[1]}`;
    const buttonSet = this.renderButtonSet();
    return (
      <View style={styles.item}>
        <Image style={styles.image} source={userPlaceholder} />
        <View style={styles.textView}>
          <Text>
            {author}
            {', '}
            {dateClean}
          </Text>
          <Text>{' '}</Text>
          <Text style={styles.description}>{body}</Text>
        </View>
        <View style={styles.answer}>
          <Text style={styles.answerText}>Answer</Text>
        </View>
        {buttonSet}
      </View>
    );
  }
}

Comment.propTypes = {
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  jwt: PropTypes.arrayOf(PropTypes.string).isRequired,
  showResolveBike: PropTypes.bool.isRequired,
  bikeId: PropTypes.string.isRequired,
};
