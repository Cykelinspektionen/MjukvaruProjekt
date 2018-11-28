import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, TouchableHighlight, RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import headerStyle from './header';
import serverApi from '../utilities/serverApi';
import Item from '../components/Item';

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
  profile: {
    height: 100,
    width: 100,
    margin: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  columnContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    margin: 20,
  },
  categories: {
    fontSize: 24,
    margin: 10,
  },
  UserInfo: {
    fontSize: 18,
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
  },
  editButtonContainer: {
    height: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 100,
    borderRadius: 5,
  },
  actionButton: {
    backgroundColor: '#00b5ec',
  },
  browserList: {
    alignSelf: 'flex-start',
    marginTop: '1%',
    marginLeft: '10%',
    width: '88%',
  },
});

class Profile extends React.Component {
    static navigationOptions = {
      ...headerStyle,
    };

    constructor(props) {
      super(props);
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
      console.log(item)
      const { navigation } = this.props;
      const bikeData = item;
      bikeData.showComments = false;// true = shows comments , false = shows similar bikes!
      bikeData.showResolveBike = true;
      return (
        <TouchableOpacity
          onPress={() => {
            bikeData.showResolveBike = true;
            bikeData.showComments = false;// true = shows comments , false = shows similar bikes!
            navigation.navigate('BikeInformation', { bikeData });
          }}
        >
          <Item
            description={item.description || ''}
            model={item.model || ''}
            imageUrl={item.image_url || ''}
            bikeData={bikeData}
            navigation={navigation}
          />
        </TouchableOpacity>
      );
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
                <Text style={styles.UserInfo}>
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
                <TouchableHighlight style={[styles.editButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => console.log('Pressed: Edit user')}>
                  <Text style={styles.greenButtonText}>EDIT USER</Text>
                </TouchableHighlight>
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
            <Text style={styles.categories}>Bikes you have submitted tips about:</Text>
          </View>
        </ScrollView>
      );
    }
}

Profile.propTypes = {
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
  const { authState, profileState } = state;
  return { authState, profileState };
};


export default connect(mapStateToProps)(Profile);
