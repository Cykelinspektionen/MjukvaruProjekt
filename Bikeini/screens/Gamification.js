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
  scoreList: {
    alignSelf: 'flex-start',
    marginTop: '1%',
    marginLeft: '3%',
    width: '88%',
  },
  topName: {
    fontSize: 18,
    marginLeft: 15,
    marginBottom: 3,
  },
  topScore: {
    fontSize: 18,
    marginBottom: 3,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    right: '5%',
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
          limit: 5,
        };
        const formBody = JSON.stringify(topScore);

        serverApi.fetchApi('users/gethighscores/', formBody, 'application/json', jwt[0])
          .then((responseJson) => {
            for (let i = 0; i < responseJson.length; i += 1) {
              topPlayersSwe.push(responseJson[i]);
            }
            this.setState({ topPlayersSwe });
            console.log(topPlayersSwe);
          }).catch(error => console.log(error));
      }


    renderSweList = () => {
      console.log('haaaaaaae');
      const { topPlayersSwe } = this.state;
      console.log('hej', topPlayersSwe);

      return (
        <View style={styles.scoreList}>
          <FlatList
            data={topPlayersSwe}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.rowContainer}>
                <Text style={styles.topName}>
                  {index + 1}
                .
                  {item.username}

                </Text>
                <Text style={styles.topScore}>
                  {item.game_score}
p
                </Text>
              </View>
            )}
          />
        </View>
      );
    }

    render() {
      const { profileState } = this.props;
      const { location } = profileState;
      const { game_score } = profileState;
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
            {this.renderSweList()}
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
