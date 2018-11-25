import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import serverApi from '../utilities/serverApi';

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
  constructor(props) {
    super(props);

    this.state = {
      comments: [{
        body: 'No comments yet! Be the first to make a comment! :)', author: '1', date: '1', _id: '1',
      }],
      matchingBikes: [],
      text: '',
    };
  }

  componentDidMount() {
    const { data } = this.props.navigation.state.params;
    const { showComments } = data;
    const { authState } = this.props;
    const { jwt } = authState;

    if (showComments) {
      this.fetchComments();
    } else {
      const formBody = this.jsonToFormData(data);

      serverApi.fetchApi('bikes/getmatchingbikes', formBody, 'multipart/form-data', jwt[0])
        .then((responseJson) => {
        }).catch(error => console.log(error));
    }
  }

  fetchComments = () => {
    const { data } = this.props.navigation.state.params;
    const { authState } = this.props;
    const { _id } = data;
    const { jwt } = authState;

    const bikeInformation = {
      bikeId: _id,
    };

    const formBody = this.jsonToFormData(bikeInformation);

    serverApi.fetchApi('bikes/getcomments', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        this.setState({ comments: responseJson });
      }).catch(error => console.log(error));
  }

  keyExtractor = item => item._id;

  renderItem = ({ item }) => {
    const {
      body, author, date, _id,
    } = item;
    return (
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('BikeInformation', {data: item})
        }}
      >
        <Comment body={body} author={author} date={date} _id={_id} />
      </TouchableOpacity>
    );
  }

  renderList = () => {
    const { showComments } = this.props.navigation.state.params.data;
    const { comments, matchingBikes } = this.state;

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
    const { _id } = this.props.navigation.state.params.data;
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

    // serverApi.fetchApi('auth', formBody, 'application/x-www-form-urlencoded', '')
    serverApi.fetchApi('bikes/addcomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then(() => {
        this.setState({ text: '' }, () => {
          this.fetchComments();
        });
      }).catch(error => console.log(error));
  }

  render() {
    const { text } = this.state;
    const { data } = this.props.navigation.state.params;
    const {
      title, location, description, brand, color, image_url,
    } = data;
    // const { city, neighborhood } = location;    <- Ingen cykel har samma data-format .....
    const city = location;
    const neighborhood = location;
    const list = this.renderList();
    const imgSource = image_url ? { uri: image_url } : stockBicycle;
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
    errorMsg: PropTypes.string.isRequired,
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
