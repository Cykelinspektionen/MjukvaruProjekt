import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, Item,
} from 'react-native';
import headerStyle from './header';
import serverApi from '../utilities/serverApi';

const profilePic = require('../assets/images/biker.png');


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
});

class Gamification extends React.Component {
    static navigationOptions = {
      ...headerStyle,
    };

    constructor(props) {
      super(props);
      this.state = {
        topPlayersSwe: '',
      };
    }

    componentDidMount() {
      this.handleServerTopPlayers();
    }

      handleServerTopPlayers = () => {
        const { authState } = this.props;
        const { jwt } = authState;

        const topPlayersSwe = [];
        const topScore = {
          limit: 10,
        };

        const formBody = this.jsonToFormData(topScore);

        serverApi.fetchApi('users/gethighscores/', formBody, 'application/x-www-form-urlencoded', jwt[0])
          .then((responseJson) => {
            for (let i = 0; i < responseJson.length; i += 1) {
              topPlayersSwe.push(responseJson[i]);
            }
            this.setState({ topPlayersSwe });
          }).catch(error => console.log(error));
      }

      keyExtractor = item => item._id;

      renderItem = ({ item }) => {
        const { navigation } = this.props;
        const bikeData = item;
        bikeData.showComments = false;// true = shows comments , false = shows similar bikes!
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BikeInformation', { data: bikeData });
            }}
          >
            <Item description={item.description} model={item.model} image_url={item.image_url} />
          </TouchableOpacity>
        );
      }

    renderSweList = () => {
      console.log('haaaaaaae');
      const { topPlayersSwe } = this.state;
      console.log('hej', topPlayersSwe);

      return (
        <View style={styles.browserList}>
          <FlatList
            data={topPlayersSwe}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      );
    }

    render() {
      const { profileState } = this.props;
      const { location } = profileState;
      const { game_score } = profileState;
      const { sweList } = this.renderSweList;
      return (
        <ScrollView style={styles.background}>
          <View style={styles.container} />
          <View style={styles.rowContainer}>
            <Image style={styles.profile} source={profilePic} />
            <View style={styles.columnContainer}>
              <Text style={styles.UserInfo}>
                Founded Bikes:
              </Text>
              <Text style={styles.UserInfo}>
                Helpfull tips:
              </Text>
              <Text style={styles.UserInfo}>
                Your stolen Bikes:
              </Text>
              <Text style={styles.UserInfo}>
                Total points earned:
                {' '}
                {game_score}
              </Text>
            </View>
          </View>
          <Text style={styles.categories}>
            Toplist in
            {' '}
            {location}
          </Text>
          <Text style={styles.categories}>Toplist in Sweden</Text>
          <View>
            {sweList}
          </View>
        </ScrollView>
      );
    }
}

Gamification.propTypes = {
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

export default connect(mapStateToProps)(Gamification);
