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
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    right: '23%',
    bottom: 6,
  },
  thumbDownTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    right: '16%',
    bottom: 6,
  },
  thumbUpTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    right: '9%',
    bottom: 6,
  },
  FoundTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 28,
    height: 27,
    right: '1%',
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

export default class Comment extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      thumbDown: false,
      thumbUp: false,
    };
  }

  sendCommentPoints = (points) => {
    const { author, jwt } = this.props;
    const formBody = {
      author, points,
    };

    console.log(jwt, formBody);
    serverApi.fetchApi(null, JSON.stringify(formBody), 'application/json', jwt[0]);
  }

  handleFound = () => {
    Alert.alert('closing ad!')
  }

  handleThumbs = (action) => {
    const { thumbDown, thumbUp } = this.state;
    switch (action) {
      case 'UP':
        if (!thumbUp) {
          this.sendCommentPoints(1);
        } else if (thumbUp) {
          this.sendCommentPoints(-1);
        }
        this.setState({ thumbUp: !thumbUp, thumbDown: false });
        break;
      case 'DW':
        if (!thumbDown && thumbUp) {
          this.sendCommentPoints(-1);
        }
        this.setState({ thumbDown: !thumbDown, thumbUp: false });
        break;
      default:
        break;
    }
  }

  render() {
    const { body, author, date } = this.props;
    const dateRaw = date.split('-');
    let day = `${dateRaw[2]}`;
    day = day.split('T');
    const dateClean = `${day[0]}/${dateRaw[1]}`;
    const { thumbDown, thumbUp } = this.state;
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

        <TouchableOpacity
          style={styles.locationTag}
          onPress={() => Alert.alert('Do something!')}
        >
          <Image
            style={styles.locationTag}
            source={locationIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.thumbDownTag}
          onPress={() => this.handleThumbs('DW')}
        >
          <Image
            style={[styles.thumbDownTag, thumbDown ? styles.setRed : []]}
            source={thumbDownIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.thumbUpTag}
          onPress={() => this.handleThumbs('UP')}
        >
          <Image
            style={[styles.thumbUpTag, thumbUp ? styles.setGreen : []]}
            source={thumbUpIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.FoundTag}
          onPress={() => this.handleFound()}
        >
          <Image
            style={styles.FoundTag}
            source={FoundBike}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

Comment.propTypes = {
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  jwt: PropTypes.arrayOf(PropTypes.string).isRequired,
};
