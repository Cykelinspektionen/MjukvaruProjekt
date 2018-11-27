import React from 'react';
import {
  StyleSheet, Text, View, Image,
} from 'react-native';
import PropTypes from 'prop-types';

const commentIcon = require('../assets/images/comment.png');
const locationIcon = require('../assets/images/location.png');
const stockBicycle = require('../assets/images/stockBicycle.png');

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
    width: 90,
    height: 90,
    marginLeft: '3%',
    backgroundColor: 'blue',
  },
  textView: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: '5%',
    marginLeft: '5%',
  },
  description: {
    fontSize: 18,
    fontWeight: '400',
  },
  model: {
    fontSize: 16,
    fontWeight: '500',
  },
  commentsTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 25,
    right: '5%',
    marginBottom: 10,
  },
  locationTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 25,
    right: '13%',
    marginBottom: 10,
  },
});

export default class Item extends React.PureComponent {
  render() {
    const { description, model, imageUrl } = this.props;
    const imgSource = imageUrl ? { uri: imageUrl } : stockBicycle;
    return (
      <View style={styles.item}>
        <Image style={styles.image} source={imgSource} />
        <View style={styles.textView}>
          <Text style={styles.description}>
            {description}
          </Text>
          <Text style={styles.model}>
            {model}
          </Text>
        </View>
        <Image style={styles.commentsTag} source={commentIcon} />
        <Image style={styles.locationTag} source={locationIcon} />
      </View>
    );
  }
}

Item.propTypes = {
  description: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};
