import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Comment from '../components/Comment';
import * as jwtActions from '../navigation/actions/JwtActions';

const stockBicycle = require('../assets/images/stockBicycle.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  image: {
    alignSelf: 'center',
    marginTop: 30,
    width: 200,
    height: 200,
  },
  descriptionContainer: {
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  headContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  head: {
    fontSize: 24,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    fontWeight: '200',
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    width: '95%',
  },
  breakLine: {
    width: '100%',
    height: '1%',
    marginTop: '1%',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
});

class BikeInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      matchingBikes: [],
    };
  }

  keyExtractor = item => item._id;

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log(item);
        // navigation.navigate('BikeInformation', {data: item})
      }}
    >
      <Comment text="abc" userId="0" />
    </TouchableOpacity>
  )

  renderList = () => {
    // const { showComments } = this.props // showComments = true -> show comments
    // showComments = false -> show matching bikes
    const { comments, matchingBikes } = this.state;
    const showComments = true;

    if (showComments) {
      return (
        <FlatList
          data={comments}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      );
    }


    return (
      <FlatList
        data={matchingBikes}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  }

  render() {
    const { data } = this.props.navigation.state.params;
    const {
      title, location, description, brand, color,
    } = data;
    const { city, neighborhood } = location;
    const list = this.renderList();
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={stockBicycle} />
        <View style={styles.descriptionContainer}>
          <View style={styles.headContainer}>
            <Text style={styles.head}>{title}</Text>
          </View>
          <Text style={styles.body}>
            {city}
            {', '}
            {neighborhood}
          </Text>
          <Text style={styles.body}>{description}</Text>
          <Text style={styles.body}>
            {brand}
            {', '}
            {color}
          </Text>
        </View>
        <View style={styles.breakLine} />
        <View style={styles.listContainer}>
          {list}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { profileState, authState } = state;
  return { profileState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...jwtActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(BikeInformation);
