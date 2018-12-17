import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TouchableHighlight, RefreshControl, Alert, Platform, ImageBackground,
} from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ImagePicker } from 'expo';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import Icon from 'react-native-vector-icons/Ionicons';
import serverApi from '../utilities/serverApi';
import permissions from '../utilities/permissions';
import Item from '../components/Item';
import * as jwtActions from '../navigation/actions/JwtActions';
import * as profileActions from '../navigation/actions/ProfileActions';
import * as mapActions from '../navigation/actions/MapActions';
import { setHoldNotification } from '../navigation/actions/RouteActions';

const background = require('../assets/images/background.jpeg');
const profilePic = require('../assets/images/userPlaceholder.jpg');

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  backImg: {
    flex: 1,
    alignSelf: 'stretch',
  },
  rowContainer: {
    flex: 0.25,
    flexDirection: 'row',
    alignContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  profile: {
    flex: 0.3,
    height: undefined,
    width: undefined,
    marginLeft: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  columnContainer: {
    flex: 0.6,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignContent: 'flex-end',
    left: 7,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  categories: {
    flex: 0.15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 5,
    fontSize: 18,
  },
  tipsBikes: {
    marginTop: '4%',
  },
  UserInfo: {
    fontSize: 17,
    paddingLeft: 5,
    borderRadius: 15,
    alignSelf: 'stretch',
  },
  greenButton: {
    backgroundColor: '#44ccad',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  greenButtonText: {
    color: 'white',
  },
  editAndLogoutButtonContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 0.075,
    borderRadius: 5,
    margin: 3,
    flexDirection: 'row',
  },
  editButtonContainer: {
    flex: 0.475,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    // ios
    shadowOpacity: 0.6,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    // android
    elevation: 5,
  },
  actionButton: {
    backgroundColor: '#00b5ec',
  },
  browserList: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  addPic: {
    justifyContent: 'flex-end',
    right: 30,
  },
  missing: {
    flex: 0.5,
    flexDirection: 'column',
    backgroundColor: 'white',
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 15,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    // ios
    shadowOpacity: 0.6,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    // android
    elevation: 5,
  },
});

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      yourBicycles: [],
      isFetching: false,
      yourTips: [],
    };
    this.cameraRollPermission = permissions.cameraRollPermission.bind(this);
  }

  componentDidMount() {
    this.getItemFromServer();
  }

  componentDidUpdate() {
    const {
      profileState, resetNotifiction, routeState, setHoldNotification, authState,
    } = this.props;
    const { profileNotification } = profileState;
    const { activeRoute } = routeState;
    const { jwt } = authState;

    if (profileNotification && activeRoute === 'Profile') {
      resetNotifiction();
      setHoldNotification();
      serverApi.post('users/updateuser/', 'has_notification=false', 'application/x-www-form-urlencoded', jwt[0])
        .catch(error => console.log(error));
    }
  }

    getItemFromServer = () => {
      const { authState } = this.props;
      const { jwt } = authState;

      serverApi.get('bikes/getmybikes/', jwt[0])
        .then((responseJson) => {
          const yourBicycles = responseJson.filter(x => x.type === 'STOLEN');
          const yourTips = responseJson.filter(x => x.type === 'FOUND');
          this.setState({ yourBicycles, yourTips, isFetching: false });
        }).catch(error => console.log(error));
    }

    keyExtractor = (item) => {
      const { _id } = item;
      return _id;
    };

    renderItem = ({ item }) => {
      if (!item.active) return null;
      const {
        navigation, profileState, setMarker, setShowMarker,
      } = this.props;
      const bikeData = item;
      bikeData.showComments = false;// true = shows comments , false = shows similar bikes!
      bikeData.showResolveBike = profileState.username === bikeData.submitter.username;
      return (
        <TouchableOpacity
          onPress={() => {
            // This is if showcomments is true from browser or item
            bikeData.showResolveBike = profileState.username === bikeData.submitter.username;
            bikeData.showComments = false;// true = shows comments , false = shows similar bikes!
            navigation.navigate('BikeInformation', { bikeData, refresh: this.onRefresh });
          }}
        >
          <Item
            actions={{ setShowMarker, setMarker }}
            location={item.location || { lat: 0, long: 0 }}
            title={item.title || ''}
            brand={item.brand || ''}
            imageUrl={item.image_url.thumbnail || ''}
            bikeData={bikeData}
            commentsLength={bikeData.comments.length}
            navigation={navigation}
            refresh={this.onRefresh}
          />
        </TouchableOpacity>
      );
    }

    onLogoutPress = () => {
      const { deleteJWTInit, navigation, unloadProfile } = this.props;
      unloadProfile();
      deleteJWTInit();
      navigation.navigate('Login');
    }

    startCameraRoll = () => {
      this.cameraRollPermission(this.pickImage);
    }

    pickImage = async () => {
      const { hasCameraRollPermission } = this.state;
      if (!hasCameraRollPermission) {
        Alert.alert('No Access');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        const {
          saveImageToState, uploadProfilePicToServer, profileState, authState,
        } = this.props;
        saveImageToState(result.uri);
        uploadProfilePicToServer(result.uri, profileState.username, authState.jwt[0]);
      }
    };

    onRefresh = () => {
      this.setState({ isFetching: true }, () => {
        this.getItemFromServer();
      });
    }

    onBackButtonPressAndroid = () => true;

    render() {
      const { yourBicycles, isFetching, yourTips } = this.state;
      const { profileState } = this.props;
      const { username } = profileState;
      const { location } = profileState;
      const { email } = profileState;

      return (
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
          <ImageBackground style={styles.backImg} source={background}>
            <View style={[styles.container, styles.background]}>
              <View style={styles.rowContainer}>

              <Image source={profileState.avatarUri.thumbnail.length ? { uri: `${profileState.avatarUri.thumbnail}?time=${new Date()}` } : profilePic} style={styles.profile} resizeMode="contain" />
              <TouchableOpacity
                style={styles.addPic}
                onPress={this.startCameraRoll}
              >
                <Icon name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'} size={35} color="black" />
              </TouchableOpacity>

                <View style={styles.columnContainer}>
                  <Text style={[styles.UserInfo, { fontWeight: 'bold' }]}>
                    {''}
                    {username}
                  </Text>
                  <Text style={styles.UserInfo}>
                    {''}
                    {location}
                  </Text>
                  <Text style={styles.UserInfo}>
                    {''}
                    {email}
                  </Text>
                </View>
              </View>
              <View style={styles.editAndLogoutButtonContainer}>
                <TouchableHighlight style={[styles.editButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => console.log('Pressed: Edit user')}>
                  <Text style={styles.greenButtonText}>EDIT USER</Text>
                </TouchableHighlight>
                <TouchableHighlight style={[styles.editButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => this.onLogoutPress()}>
                  <Text style={styles.greenButtonText}>LOG OUT</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.missing}>
                <Text style={styles.categories} adjustsFontSizeToFit>Your missing bikes:</Text>
                <View
                  style={styles.browserList}
                >
                  <FlatList
                    data={yourBicycles}
                    keyExtractor={this.keyExtractor}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    refreshControl={(
                      <RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={isFetching}
                      />
            )}
                  />
                </View>
              </View>
              <View style={styles.missing}>
                <Text style={styles.categories} adjustsFontSizeToFit>Bikes you have submitted tips about:</Text>
                <View style={styles.browserList}>
                  <FlatList
                    data={yourTips}
                    keyExtractor={this.keyExtractor}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    refreshControl={(
                      <RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={isFetching}
                      />
          )}
                  />
                </View>
              </View>
            </View>
          </ImageBackground>
        </AndroidBackHandler>

      );
    }
}

Profile.propTypes = {
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
    imgToUploadUri: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.number.isRequired,
    create_time: PropTypes.string.isRequired,
    avatarUri: PropTypes.shape({
      img: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
    }).isRequired,
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
  routeState: PropTypes.shape({
    activeRoute: PropTypes.string.isRequired,
  }).isRequired,
  uploadProfilePicToServer: PropTypes.func.isRequired,
  deleteJWTInit: PropTypes.func.isRequired,
  unloadProfile: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  setShowMarker: PropTypes.func.isRequired,
  resetNotifiction: PropTypes.func.isRequired,
  setHoldNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState, routeState } = state;
  return { authState, profileState, routeState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setHoldNotification, ...jwtActions, ...profileActions, ...mapActions,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
