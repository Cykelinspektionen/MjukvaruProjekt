import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import headerStyle from './header';
import serverApi from '../utilities/serverApi';
import Item from '../components/Item';

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
});

class Profile extends React.Component {
    static navigationOptions = {
      ...headerStyle,
    };

    constructor(props) {
      super(props);
      this.state = {
        yourBicycles: '',
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
          this.setState({ yourBicycles });
        }).catch(error => console.log(error));
    }

    keyExtractor = item => item._id;

    renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => console.log(`pressed: ${item.description}`)}
      >
        <Item description={item.description} model={item.model} />
      </TouchableOpacity>
    );

    render() {
      const { yourBicycles } = this.state;
      const { profileState } = this.props;
      const { username } = profileState;
      const { location } = profileState;
      const { email } = profileState;


      return (
        <ScrollView style={styles.background}>
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
            <FlatList
              data={yourBicycles}
              keyExtractor={this.keyExtractor}
              extraData={this.state}
              renderItem={this.renderItem}
            />
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
    errorMsg: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};


export default connect(mapStateToProps)(Profile);