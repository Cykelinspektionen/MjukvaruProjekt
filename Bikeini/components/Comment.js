import React from 'react';
import {
  StyleSheet, Text, View, Image,
} from 'react-native';
import PropTypes from 'prop-types';

const locationIcon = require('../assets/images/location.png');
const thumbUpIcon = require('../assets/images/thumbup.png');
const thumbDownIcon = require('../assets/images/thumbdown.png');
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
});

export default class Comment extends React.PureComponent {
  render() {
    const { body, author, date } = this.props;
    const dateRaw = date.split('-');
    let day = `${dateRaw[2]}`;
    day = day.split('T');
    const dateClean = `${day[0]}/${dateRaw[1]}`;

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

        <Image style={styles.locationTag} source={locationIcon} />
        <Image style={styles.thumbDownTag} source={thumbDownIcon} />
        <Image style={styles.thumbUpTag} source={thumbUpIcon} />
        <Image style={styles.FoundTag} source={FoundBike} />
      </View>
    );
  }
}

Comment.propTypes = {
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
};
