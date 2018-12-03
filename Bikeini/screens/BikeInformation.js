import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, Alert, TouchableHighlight,
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
    width: '100%',
    flex: 0.5,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  descriptionContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    width: '100%',
    flex: 0.2,
  },
  colFlex: {
    flexDirection: 'column',
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
  closeButton: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  buttonSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: '5%',
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
    margin: 5,
  },
});

const thumbScore = 'thumb_score';
const bikeScore = 'bike_score';

class BikeInformation extends React.Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { bikeData, refresh } = params;

    this.state = {
      comments: [{
        body: 'No comments yet! Be the first to make a comment! :)', author: '1', date: '1', _id: '1',
      }],
      matchingBikes: [],
      text: '',
      bikeData,
      refresh,
    };
  }

  componentDidMount() {
    const { bikeData } = this.state;
    if (bikeData.showComments) {
      this.fetchComments();
    } else {
      this.fetchSimilarBikes();
    }
  }

  fetchSimilarBikes = () => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { jwt } = authState;

    const formBody = this.jsonToFormData(bikeData);

    serverApi.fetchApi('bikes/getmatchingbikes', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        if (responseJson.length > 0) {
          responseJson.reverse();
          this.setState({ matchingBikes: responseJson });
        }
      }).catch(error => console.log(error));
  }

  fetchComments = () => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { _id } = bikeData;
    const { jwt } = authState;

    const bikeInformation = {
      bikeId: _id,
    };

    const formBody = this.jsonToFormData(bikeInformation);

    serverApi.fetchApi('bikes/getcomments', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        if (responseJson.length > 0) {
          responseJson.reverse();
          this.setState({ comments: responseJson });
        }
      }).catch(error => console.log(error));
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  };

  renderItem = ({ item }) => {
    let {
      bikeData,
    } = this.state;
    const { refresh } = this.state;
    const { _id } = bikeData;
    const { authState, navigation, profileState } = this.props;

    if (bikeData.showComments) {
      const {
        body, author, date,
      } = item;
      const { jwt } = authState;
      const ownersComment = profileState.username === item.author;
      return (
        <TouchableOpacity
          onPress={() => {}}
        >
          <Comment
            body={body}
            author={author}
            date={date}
            jwt={jwt}
            showResolveBike={bikeData.showResolveBike}
            bikeId={_id}
            navigation={navigation}
            refresh={refresh}
            ownersComment={ownersComment}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          bikeData = item;
          bikeData.showComments = true;
          bikeData.showResolveBike = profileState.id === bikeData.submitter;
          this.setState({ bikeData }, () => {
            this.fetchComments();
          });
        }}
      >
        <Item
          description={item.description || ''}
          model={item.model || ''}
          imageUrl={item.image_url || ''}
          bikeData={bikeData}
          navigation={navigation}
          refresh={refresh}
        />
      </TouchableOpacity>
    );
  }

  renderList = () => {
    const {
      comments, matchingBikes, bikeData,
    } = this.state;

    if (bikeData.showComments) {
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
    const { text, bikeData } = this.state;
    const { _id } = bikeData;
    const { authState, profileState } = this.props;
    const { username } = profileState;
    const { jwt } = authState;

    const commentInformation = {
      username,
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
    const { text, bikeData } = this.state;

    if (bikeData.showComments) {
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

  renderFoundButton = () => {
    const { bikeData } = this.state;
    const { profileState } = this.props;
    // TODO: change to submitter.user_name, when backend fixes submitter
    const bikeSubmitter = bikeData.submitter._id || bikeData.submitter;
    if (bikeSubmitter === profileState.id || bikeData.type === 'FOUND') {
      return (
        <View style={styles.closeButton}>
          <TouchableHighlight style={[styles.buttonSmall, styles.greenButton]} onPress={() => this.handleFound()}>
            <Text style={styles.greenButtonText}>BIKE IS FOUND</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
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

  setBikeToFound = () => {
    const { authState, navigation } = this.props;
    const { bikeData, refresh } = this.state;
    // TODO change to userName when backend fixes submitter to user_name
    const bikeSubmitter = bikeData.submitter._id || bikeData.submitter;
    const formBody = {
      id: bikeData._id,
      active: false,
	    type: 'FOUND',
    };
    serverApi.fetchApi('bikes/updatebike/', JSON.stringify(formBody), 'application/json', authState.jwt[0])
      .then(
        refresh(),
        // TODO change to userName when backend fixes submitter to user_name
        bikeData.type === 'FOUND' && profileState.id !== bikeSubmitter ? this.sendPointsToUser(5, bikeScore) : null,
        navigation.navigate('Browser'),
      );
  }

  sendPointsToUser = (points, type) => {
    const { authState } = this.props;
    const { bikeData } = this.state;
    // TODO: change to submitter.user_name, when backend fixes submitter
    const bikeSubmitter = bikeData.submitter._id || bikeData.submitter;
    const formBody = {
      user_name: bikeSubmitter,
      points,
      type,
    };
    serverApi.fetchApi('users/updateHighscore/', JSON.stringify(formBody), 'application/json', authState.jwt[0])
      .then((responseJson) => {
        console.log(responseJson);
      }).catch(error => console.log(error));
  }

  render() {
    const { bikeData } = this.state;
    const {
      title, location, description, brand, color,
    } = bikeData;
    const city = location ? location.city : '';
    const neighborhood = location ? location.neighborhood : '';

    const list = this.renderList();
    const commentField = this.renderCommentField();
    const foundButton = this.renderFoundButton();
    const imgSource = bikeData.image_url ? { uri: bikeData.image_url } : stockBicycle;

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="contain" resizeMethod="scale" source={imgSource} />
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.colFlex}>
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
          {foundButton}
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
    id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.number.isRequired,
    create_time: PropTypes.string.isRequired,
    game_score: PropTypes.shape({
      bike_score: PropTypes.number.isRequired,
      bikes_lost: PropTypes.number.isRequired,
      thumb_score: PropTypes.number.isRequired,
      total_score: PropTypes.number.isRequired,
    }).isRequired,
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
