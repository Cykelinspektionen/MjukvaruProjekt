import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import PropTypes from 'prop-types';

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
    width: '20%',
    height: '80%',
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
  location: {
    fontSize: 16,
    fontWeight: '500',
  },
  commentsTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 25,
    right: '5%',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  locationTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 25,
    right: '13%',
    backgroundColor: 'black',
  },
});

export default class Item extends React.PureComponent {
  render() {
    const { name, location } = this.props;
    return (
      <View style={styles.item}>
        <View style={styles.image} />
        <View style={styles.textView}>
          <Text style={styles.description}>
            {name}
          </Text>
          <Text style={styles.location}>
            {location}
          </Text>
        </View>
        <View style={styles.commentsTag} />
        <View style={styles.locationTag} />
      </View>
    );
  }
}

Item.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};
