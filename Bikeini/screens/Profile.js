import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TouchableHighlight, RefreshControl, Alert, Platform, Modal,
} from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ImagePicker } from 'expo';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import Icon from 'react-native-vector-icons/Ionicons';
import { headerStyle } from './header';
import serverApi from '../utilities/serverApi';
import permissions from '../utilities/permissions';
import Item from '../components/Item';
import EditProfileModal from '../components/EditProfileModal';
import * as jwtActions from '../navigation/actions/JwtActions';
import * as profileActions from '../navigation/actions/ProfileActions';
import * as mapActions from '../navigation/actions/MapActions';

const profilePic = require('../assets/images/userPlaceholder.jpg');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rowContainer: {
    flex: 0.20,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 5,
  },
  profile: {
    flex: 0.5,
    height: undefined,
    width: undefined,
  },
  columnContainer: {
    flex: 0.5,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignContent: 'flex-start',
    marginLeft: 2,
  },
  categories: {
    flex: 0.05,
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
  },
  greenButton: {
    backgroundColor: '#44ccad',
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
    flexDirection: 'row',
  },
  editButtonContainer: {
    flex: 0.475,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 2,
  },
  actionButton: {
    backgroundColor: '#00b5ec',
  },
  browserList: {
    flex: 0.4,
    width: '100%',
    alignSelf: 'center',
  },
  addPic: {
    justifyContent: 'flex-end',
  },
  modalContaner: {
    backgroundColor: '#44ccad',
    flex: 1,
  },
});

class Profile extends React.Component {
    static navigationOptions = {
      ...headerStyle,
    };

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
          <View style={[styles.container, styles.background]}>
            <EditProfileModal />
            <View style={styles.rowContainer}>

              <Image source={profileState.avatarUri.thumbnail.length ? { uri: profileState.avatarUri.thumbnail } : profilePic} style={styles.profile} resizeMode="contain" />
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
              <TouchableHighlight style={[styles.editButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => this.editProfilePress()}>
                <Text style={styles.greenButtonText}>EDIT USER</Text>
              </TouchableHighlight>
              <TouchableHighlight style={[styles.editButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => this.onLogoutPress()}>
                <Text style={styles.greenButtonText}>LOG OUT</Text>
              </TouchableHighlight>
            </View>
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
            <Text style={[styles.categories, styles.tipsBikes]}>Bikes you have submitted tips about:</Text>
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
  uploadProfilePicToServer: PropTypes.func.isRequired,
  deleteJWTInit: PropTypes.func.isRequired,
  unloadProfile: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  setShowMarker: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...jwtActions, ...profileActions, ...mapActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
