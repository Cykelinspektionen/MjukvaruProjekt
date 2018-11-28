import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import serverApi from '../utilities/serverApi';
import * as jwtActions from '../navigation/actions/JwtActions';

import Item from '../components/Item';
import Comment from '../components/Comment';

const stockBicycle = require('../assets/images/stockBicycle.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 30,
    width: 400,
    height: 200,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
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
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 40,
    width: '95%',
    borderWidth: 1,
    marginBottom: 2,
  },
  send: {
    alignSelf: 'center',
    width: '15%',
  },
  sendText: {
    color: 'blue',
    fontSize: 14,
    fontWeight: '300',
  },
  commentInput: {
    height: '100%',
    marginLeft: '2%',
    width: '83%',
  },
});

class BikeInformation extends React.Component {
  constructor() {
    super();

    this.state = {
      comments: [{
        body: 'No comments yet! Be the first to make a comment! :)', author: '1', date: '1', _id: '1',
      }],
      matchingBikes: [],
      text: '',
      dataLoaded: false,
      showComments: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { data } = params;
    const { showComments } = data;
    this.setState({ showComments });
  }

  componentDidUpdate() {
    const { showComments, dataLoaded } = this.state;

    if (showComments && !dataLoaded) {
      this.fetchComments();
    } else if (!dataLoaded) {
      this.fetchSimilarBikes();
    }
  }

  fetchSimilarBikes = () => {
    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { data } = params;
    const { authState } = this.props;
    const { jwt } = authState;

    const formBody = this.jsonToFormData(data);

    // multipart/form-data
    serverApi.fetchApi('bikes/getmatchingbikes', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        if (responseJson.length > 0) {
          responseJson.reverse();
          this.setState({ matchingBikes: responseJson, dataLoaded: true });
        } else {
          this.setState({ dataLoaded: true });
        }
      }).catch(error => console.log(error));
  }

  fetchComments = () => {
    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { data } = params;
    const { authState } = this.props;
    const { _id } = data;
    const { jwt } = authState;

    const bikeInformation = {
      bikeId: _id,
    };

    const formBody = this.jsonToFormData(bikeInformation);

    serverApi.fetchApi('bikes/getcomments', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        if (responseJson.length > 0) {
          responseJson.reverse();
          this.setState({ comments: responseJson, dataLoaded: true });
        } else {
          this.setState({ dataLoaded: true });
        }
      }).catch(error => console.log(error));
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  };

  renderItem = ({ item }) => {
    const { showComments } = this.state;
    const { navigation, authState } = this.props;

    if (showComments) {
      const {
        body, author, date,
      } = item;
      const { jwt } = authState;
      console.log(item);
      return (
        <TouchableOpacity
          onPress={() => {}}
        >
          <Comment body={body} author={author} date={date} jwt={jwt} />
        </TouchableOpacity>
      );
    }


    const {
      description, model,
    } = item;
    const bikeData = item;
    bikeData.showComments = true;// true = shows comments , false = shows similar bikes!
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BikeInformation', { data: bikeData });
        }}
      >
        <Item
          description={description || ''}
          model={model || ''}
          imageUrl={item.image_url || ''}
          bikeData={bikeData}
          navigation={navigation}
        />
      </TouchableOpacity>
    );
  }

  renderList = () => {
    const { showComments, comments, matchingBikes } = this.state;

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

  jsonToFormData = (details) => {
    const formBody = Object.entries(details).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return formBody;
  }

  sendComment = () => {
    const { text } = this.state;
    const { authState } = this.props;
    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { data } = params;
    const { _id } = data;
    const { jwt } = authState;

    const commentInformation = {
      bikeId: _id,
      body: text,
    };


    if (text === '') {
      Alert.alert('You must add some text :0 !');
      return;
    }

    const formBody = this.jsonToFormData(commentInformation);

    serverApi.fetchApi('bikes/addcomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then(() => {
        this.setState({ text: '' }, () => {
          this.fetchComments();
        });
      }).catch(error => console.log(error));
  }

  renderCommentField = () => {
    const { showComments, text } = this.state;

    if (showComments) {
      return (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            onChangeText={newText => this.setState({ text: newText })}
            value={text}
            placeholder="Add comment..."
          />
          <View style={styles.send}>
            <TouchableOpacity
              onPress={() => {
                this.sendComment();
              }}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }


    return null;
  }

  render() {
    const { dataLoaded } = this.state;
    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { data } = params;
    const {
      title, location, description, brand, color,
    } = data;
    // const { city, neighborhood } = location;    <- Ingen cykel har samma data-format .....
    // small fix until db can be cleaned
    const city = location ? location.city : '';
    const neighborhood = location ? location.neighborhood : '';
    if (!dataLoaded) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }
    const list = this.renderList();
    const commentField = this.renderCommentField();
    const imgSource = data.image_url ? { uri: data.image_url } : stockBicycle;
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="contain" resizeMethod="scale" source={imgSource} />
        </View>
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
        {commentField}
      </View>
    );
  }
}

BikeInformation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
  profileState: PropTypes.shape({
    location: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.number.isRequired,
    create_time: PropTypes.string.isRequired,
    game_score: PropTypes.number.isRequired,
    loadingProfile: PropTypes.bool.isRequired,
    profileLoaded: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { profileState, authState } = state;
  return { profileState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...jwtActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(BikeInformation);
