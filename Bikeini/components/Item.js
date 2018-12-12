import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import serverApi from '../utilities/serverApi';

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
  commentsNumber: {
    zIndex: 2,
  },
});

export default class Item extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      comments: 0,
    };
  }

 /* getNbrOfComments = () => {
    const { comments } = this.state;

    const formBody = this.jsonToFormData(bikeInformation);

    serverApi.get('bikes/getcomments', jwt[0])
      .then((responseJson) => {
        if (responseJson.length > 0) {
          responseJson.reverse();
          this.setState({ comments });
        }
      }).catch(error => console.log(error));
  } */

  render() {
    const {
      title, brand, imageUrl, bikeData, navigation, refresh,
    } = this.props;
    const imgSource = imageUrl ? { uri: imageUrl } : stockBicycle;
   // const nbrOfComments = this.getNbrOfComments();
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
            <Text style={styles.commentsNumber}>
              {/* {nbrOfComments} */}
              5
            </Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationTag}
            onPress={() => { Alert.alert('Position me blokitch'); }}
          >
            <Image style={styles.locationTag} source={locationIcon} />
          </TouchableOpacity>
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
};
