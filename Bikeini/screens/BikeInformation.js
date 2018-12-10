import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, Alert, TouchableHighlight, KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import serverApi from '../utilities/serverApi';
import * as jwtActions from '../navigation/actions/JwtActions';
import * as mapActions from '../navigation/actions/MapActions';
import Item from '../components/Item';
import Comment from '../components/Comment';
import { bikeScore } from '../utilities/Const';
import { headerBackStyle } from './header';

import DialogInput from 'react-native-dialog-input';

const locationIcon = require('../assets/images/location.png');
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
    marginBottom: 5,
    width: '100%',
    height: 125,
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
    marginBottom: 30,
  },
  breakLine: {
    width: '100%',
    height: 5,
    marginTop: 5,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  commentInputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 40,
    width: '90%',
    borderWidth: 1,
    marginBottom: 15,
    paddingRight: 1,
  },
  send: {
    alignSelf: 'center',
  },
  sendText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '300',
  },
  commentInput: {
    flex: 1,
    height: '100%',
    marginLeft: '2%',
  },
  closeButton: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  buttonSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: '5%',
  },
  buttonCorner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    height: '100%',
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
    margin: 5,
  },
  matchAndComText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  locationTag: {
    width: 25,
    height: '90%',
  },
});


class BikeInformation extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { bikeData, refresh } = params;

    this.state = {
      comments: [{
        body: 'No comments yet! Be the first to make a comment! :)', author: { username: '1', avatar_url: '' }, date: '1', _id: '1', rating: { down: [], up: [] },
      }],
      matchingBikes: [],
      text: '',
      bikeData,
      refresh,
      isDialogVisible: false,
    };

    this.editCommentId = 0;
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
    console.log(formBody);

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
    const {
      authState, navigation, profileState, setMarker, setShowMarker,
    } = this.props;

    if (bikeData.showComments) {
      const {
        author,
      } = item;
      const { jwt } = authState;
      const ownersComment = profileState.username === item.author.username;
      bikeData.showResolveBike = bikeData.submitter.username !== item.author.username && bikeData.type === 'FOUND';
      if(author._id === profileState.id) {
        console.log(item._id);
      }
      return (
        <TouchableOpacity
          onLongPress={() => {
            if(author._id === profileState.id) {
              this.editCommentId = item._id;
              Alert.alert(
                'Edit/remove comment',
                'What action do you want to do? :]',
                [
                  {text: 'Edit', onPress: () => this.setState({isDialogVisible: true},
                    () => {
                      //this.editCommentId = item._id;
                    })},
                  {text: 'Remove', onPress: () => {this.removeComment()} },
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
              )
            }
          }}
        >
          <Comment
            actions={{ setShowMarker, setMarker }}
            body={item.body}
            commentId={item._id}
            rating={item.rating}
            date={item.date}
            location={item.location || { lat: 0, long: 0 }}
            bikeSubUsername={bikeData.submitter.username || ''}
            bikeType={bikeData.type}
            showResolveBike={bikeData.showResolveBike}
            bikeId={bikeData._id}
            avatarUri={author.avatar_url || ''}
            myId={profileState.id}
            username={author.username}
            jwt={jwt}
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
          bikeData.showResolveBike = profileState.username === bikeData.submitter.username;
          this.setState({ bikeData }, () => {
            this.fetchComments();
          });
        }}
      >
        <Item
          title={item.title || ''}
          brand={item.brand || ''}
          imageUrl={item.image_url.thumbnail || ''}
          bikeData={bikeData}
          navigation={navigation}
          refresh={refresh}
        />
      </TouchableOpacity>
    );
  }

  renderList = () => {
    const {
      comments, bikeData,
    } = this.state;
    const { matchingBikes } = this.state;
    const matchingBikesFiltered = matchingBikes.filter(x => x.active === true);


    if (bikeData.showComments) {
      return (
        <View>
          <Text style={styles.matchAndComText}> COMMENTS </Text>
          <View style={styles.breakLine} />
          <FlatList
            data={comments}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      );
    }


    return (
      <View>
        <Text style={styles.matchAndComText}> MATCHING BIKES </Text>
        <View style={styles.breakLine} />
        <FlatList
          data={matchingBikesFiltered}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  jsonToFormData = (details) => {
    const formBody = Object.entries(details).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return formBody;
  }

  sendComment = () => {
    const { text, bikeData } = this.state;
    const { _id } = bikeData;
    const {
      authState, profileState, mapState, cleanMapState,
    } = this.props;
    const { username } = profileState;
    const { jwt } = authState;

    const commentInformation = {
      username,
      bikeId: _id,
      body: text,
      lat: mapState.userMarker.userMarkerSet ? mapState.userMarker.latitude : null,
      long: mapState.userMarker.userMarkerSet ? mapState.userMarker.longitude : null,
    };
    if (text === '') {
      Alert.alert('You must add some text :0 !');
      return;
    }
    const formBody = this.jsonToFormData(commentInformation);
    serverApi.fetchApi('bikes/addcomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then(() => {
        this.setState({ text: '' }, () => {
          cleanMapState();
          this.fetchComments();
        });
      }).catch(error => console.log(error));
  }

  renderCommentField = () => {
    const { text, bikeData } = this.state;
    const { navigation } = this.props;
    if (bikeData.showComments) {
      return (
        <View style={styles.commentInputContainer}>
          <TouchableOpacity
            style={[styles.locationTag, styles.send]}
            onPress={() => navigation.navigate('PinMap')}
          >
            <Image
              style={styles.locationTag}
              source={locationIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.commentInput}
            onChangeText={newText => this.setState({ text: newText })}
            value={text}
            placeholder="Add comment..."
          />
          <View style={[styles.send, styles.buttonCorner, styles.greenButton]}>
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
    // TODO: change to submitter.username, when backend fixes submitter
    const bikeSubmitter = bikeData.submitter.username || bikeData.submitter;
    if (bikeSubmitter === profileState.username || bikeData.type === 'FOUND') {
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
    const { authState, navigation, profileState } = this.props;
    const { bikeData, refresh } = this.state;
    // TODO change to userName when backend fixes submitter to username
    const bikeSubmitter = bikeData.submitter.username || bikeData.submitter;
    const formBody = {
      id: bikeData._id,
      active: false,
	    type: 'FOUND',
    };
    serverApi.fetchApi('bikes/updatebike/', JSON.stringify(formBody), 'application/json', authState.jwt[0])
      .then(
        refresh(),
        // TODO change to userName when backend fixes submitter to username
        bikeData.type === 'FOUND' && profileState.id !== bikeSubmitter ? this.sendPointsToUser(5, bikeScore) : null,
        navigation.navigate('Browser'),
      );
  }

  sendPointsToUser = (points, type) => {
    const { authState } = this.props;
    const { bikeData } = this.state;
    // TODO: change to submitter.username, when backend fixes submitter
    const bikeSubmitter = bikeData.submitter.username || bikeData.submitter;
    const formBody = { username: bikeSubmitter };
    formBody[type] = points;
    serverApi.fetchApi('users/updatehighscore/', JSON.stringify(formBody), 'application/json', authState.jwt[0])
      .catch(error => console.log(error));
  }

  changeCommentText = (text) => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { _id } = bikeData;
    const { jwt } = authState;

    const bikeInformation = {
      bikeId: _id,
    };

    const body = {bikeId: _id, commentId: this.editCommentId, body: text};
    const formBody = this.jsonToFormData(body);
    serverApi.post('bikes/editcomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        this.setState({isDialogVisible: false}, () => {
          this.fetchComments();
        })
      }).catch(error => {
        console.log(error);
        this.setState({isDialogVisible: false});
      });
  }

  removeComment = () => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { _id } = bikeData;
    const { jwt } = authState;

    const bikeInformation = {
      bikeId: _id,
    };

    const body = { bikeId: _id, commentId: this.editCommentId };
    const formBody = this.jsonToFormData(body);
    console.log('formBody: ' + formBody);

    serverApi.post('bikes/removecomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        this.fetchComments();
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    const { bikeData } = this.state;
    const {
      title, location, description, brand, color, frameNumber, model,
    } = bikeData;
    const city = location ? location.city : '';
    const neighborhood = location ? location.neighborhood : '';

    const list = this.renderList();
    const commentField = this.renderCommentField();
    const foundButton = this.renderFoundButton();
    const imgSource = bikeData.image_url ? { uri: bikeData.image_url.img } : stockBicycle;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
              title={"Edit comment"}
              hintInput ={"New comment..."}
              submitInput={ (inputText) => {this.changeCommentText(inputText)} }
              closeDialog={ () => {this.setState({isDialogVisible: false})}}>
        </DialogInput>
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
              {' '}
              {model}
              {', '}
              {color}
            </Text>
            <Text style={styles.body}>
              Frame number:
              {' '}
              {frameNumber}
            </Text>
          </View>
          {foundButton}
        </View>
        <View style={styles.breakLine} />
        <View style={styles.listContainer}>
          {list}
        </View>
        {commentField}
      </KeyboardAvoidingView>
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
  mapState: PropTypes.shape({
    userMarker: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      userMarkerSet: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  cleanMapState: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  setShowMarker: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { profileState, authState, mapState } = state;
  return { profileState, authState, mapState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...jwtActions, ...mapActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(BikeInformation);
