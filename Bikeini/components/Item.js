import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, Alert,
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
    flexWrap: 'wrap',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
  brand: {
    fontSize: 16,
    fontWeight: '500',
  },
  commentsTag: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  locationTag: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  buttonRow: {
    flex: 0.25,
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
  },
});

export default class Item extends React.PureComponent {
  handleLocation = () => {
    const { actions, location, navigation } = this.props;
    actions.setMarker({ latitude: location.lat, longitude: location.long });
    actions.setShowMarker(true);
    navigation.navigate('PinMap');
  }

  render() {
    const {
      title, brand, imageUrl, bikeData, navigation, refresh, location,
    } = this.props;
    console.log('latte', location);
    const imgSource = imageUrl ? { uri: imageUrl } : stockBicycle;
    let locationButton = null;
    if (location.lat && location.long) {
      locationButton = (
        <TouchableOpacity
          style={styles.locationTag}
          onPress={() => this.handleLocation()}
        >
          <Image style={styles.locationTag} source={locationIcon} />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.item}>
        <Image style={styles.image} source={imgSource} />
        <View style={styles.textView}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.brand}>
            {brand}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.commentsTag}
            onPress={() => {
              bikeData.showComments = true;
              navigation.navigate('BikeInformation', { bikeData, refresh });
            }}
          >
            <Image style={styles.commentsTag} source={commentIcon} />

          </TouchableOpacity>
          {locationButton}
        </View>
      </View>
    );
  }
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  bikeData: PropTypes.shape({
    showComments: PropTypes.bool.isRequired,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    setShowMarker: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
  }).isRequired,
};
