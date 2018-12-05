import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, TouchableHighlight, RefreshControl,
} from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import headerStyle from './header';
import serverApi from '../utilities/serverApi';
import Item from '../components/Item';
import * as jwtActions from '../navigation/actions/JwtActions';
import * as profileActions from '../navigation/actions/ProfileActions';

const profilePic = require('../assets/images/userPlaceholder.jpg');

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: '2%',
    left: '30%',
  },
  profile: {
    height: '92%',
    width: '28%',
  },
  columnContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginTop: '4%',
    marginLeft: '4%',
  },
  categories: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: '2%',
  },
  tipsBikes: {
    marginTop: '4%',
  },
  UserInfo: {
    fontSize: 17,
    left: '20%',
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
  },
  editAndLogoutButtonContainer: {
    height: '25%',
    width: '90%',
    borderRadius: 5,
    flexDirection: 'row',
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    borderRadius: 5,
    margin: 2,
  },
  actionButton: {
    backgroundColor: '#00b5ec',
  },
  browserList: {
    alignSelf: 'center',
    margin: '1%',
    width: '95%',
    height: '200%',
    marginBottom: '5%',
  },
});

class Profile extends React.Component {
    static navigationOptions = {
      ...headerStyle,
    };

    constructor() {
      super();
      this.state = {
        yourBicycles: '',
        isFetching: false,
      };
    }

    componentDidMount() {
      this.getItemFromServer();
    }

    getItemFromServer = () => {
      const { authState } = this.props;
      const { jwt } = authState;

      const yourBicycles = [];

      serverApi.get('bikes/getmybikes/', jwt[0])
        .then((responseJson) => {
          for (let i = 0; i < responseJson.length; i += 1) {
            yourBicycles.push(responseJson[i]);
          }
          this.setState({ yourBicycles, isFetching: false });
        }).catch(error => console.log(error));
    }

    keyExtractor = (item) => {
      const { _id } = item;
      return _id;
    };

    renderItem = ({ item }) => {
      if (!item.active) return null;
      const { navigation } = this.props;
      const bikeData = item;
      bikeData.showComments = false;// true = shows comments , false = shows similar bikes!
      bikeData.showResolveBike = true;
      return (
        <TouchableOpacity
          onPress={() => {
            bikeData.showResolveBike = true;
            bikeData.showComments = false;// true = shows comments , false = shows similar bikes!
            navigation.navigate('BikeInformation', { bikeData, refresh: this.onRefresh });
          }}
        >
          <Item
            description={item.description || ''}
            model={item.model || ''}
            imageUrl={item.image_url || ''}
            bikeData={bikeData}
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


    onRefresh = () => {
      this.setState({ isFetching: true }, () => {
        this.getItemFromServer();
      });
    }

    render() {
      const { yourBicycles, isFetching } = this.state;
      const { profileState } = this.props;
      const { username } = profileState;
      const { location } = profileState;
      const { email } = profileState;

      return (
        <ScrollView
          style={styles.background}
          refreshControl={(
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={isFetching}
            />
)}
        >
          <View style={styles.container}>
            <View style={styles.rowContainer}>
              <Image style={styles.profile} source={profilePic} />
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
                <View style={styles.editAndLogoutButtonContainer}>
                  <TouchableHighlight style={[styles.editButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => console.log('Pressed: Edit user')}>
                    <Text style={styles.greenButtonText}>EDIT USER</Text>
                  </TouchableHighlight>
                  <TouchableHighlight style={[styles.editButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => this.onLogoutPress()}>
                    <Text style={styles.greenButtonText}>LOG OUT</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <Text style={styles.categories}>Your missing bikes:</Text>
            <View style={styles.browserList}>
              <FlatList
                data={yourBicycles}
                keyExtractor={this.keyExtractor}
                extraData={this.state}
                renderItem={this.renderItem}
              />
            </View>
            <Text style={[styles.categories, styles.tipsBikes]}>Bikes you have submitted tips about:</Text>
          </View>
        </ScrollView>
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
  deleteJWTInit: PropTypes.func.isRequired,
  unloadProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...jwtActions, ...profileActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
