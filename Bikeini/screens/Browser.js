import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Filter from '../components/Filter';
import Item from '../components/Item';
import serverApi from '../utilities/serverApi';
import headerStyle from './header';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    alignSelf: 'flex-start',
    marginTop: '5%',
    marginLeft: '13%',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  filter: {
    alignSelf: 'flex-start',
    marginTop: '5%',
    marginLeft: '13%',
  },
  browserList: {
    flex: 1,
    alignSelf: 'flex-start',
    marginTop: '10%',
    marginLeft: '10%',
    width: '88%',
  },
  showType: {
    alignSelf: 'flex-start',
    position: 'absolute',
    marginTop: '8%',
    marginLeft: 10,
    backgroundColor: 'black',
    width: 20,
    height: 60,
  },
});

class Browser extends React.Component {
  static navigationOptions = {
    ...headerStyle,
  };

  constructor(props) {
    super(props);

    this.state = {
      showMissing: true,
      missingBicycles: '',
      foundBicycles: '',
      showFilter: false,
    };
  }

  componentDidMount() {
    this.handleServerBicycles();
  }

  handleServerBicycles = () => {
    const { authState } = this.props;
    const { jwt } = authState;

    const foundBicycles = [];
    const missingBicycles = [];

    serverApi.fetchApi('bikes/getfoundbikes/', jwt[0])
      .then((responseJson) => {
        for (let i = 0; i < responseJson.length; i += 1) {
          foundBicycles.push(responseJson[i]);
        }
        this.setState({ foundBicycles });
      }).catch(error => console.log(error));

    serverApi.get('bikes/getstolenbikes/', jwt[0])
      .then((responseJson) => {
        for (let i = 0; i < responseJson.length; i += 1) {
          missingBicycles.push(responseJson[i]);
        }
        this.setState({ missingBicycles });
      }).catch(error => console.log(error));
  }

  keyExtractor = item => item._id;

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    item.showComments = true;
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item);
          navigation.navigate('BikeInformation', { data: item });
        }}
      >
        <Item description={item.description} model={item.model} image_url={item.image_url} />
      </TouchableOpacity>
    );
  }

  renderHeader = () => {
    const { showMissing } = this.state;
    const { profileState } = this.props;
    const { location } = profileState;

    if (showMissing) {
      return (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Missing bikes in
            {' '}
            {location}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
            Found bikes in
          {' '}
          {location}
        </Text>
      </View>
    );
  }

  switchPageType = () => {
    this.setState(prevState => ({
      showMissing: !prevState.showMissing,
    }));
  }

  renderFilter = () => {
    const { showFilter } = this.state;

    if (showFilter) {
      return <Filter search={this.search} />;
    }

    return null;
  }

  renderList = () => {
    const { showMissing, missingBicycles, foundBicycles } = this.state;

    if (showMissing) {
      return (
        <View style={styles.browserList}>
          <FlatList
            data={missingBicycles}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      );
    }


    return (
      <View style={styles.browserList}>
        <FlatList
          data={foundBicycles}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  changeFilterStatus = () => {
    const { showFilter } = this.state;

    this.setState({ showFilter: !showFilter });
  }

  render() {
    const header = this.renderHeader();
    const filter = this.renderFilter();
    const list = this.renderList();
    return (
      <View style={styles.container}>
        {header}
        <TouchableOpacity
          style={styles.showType}
          onPress={this.switchPageType}
        />
        <TouchableOpacity
          style={styles.filter}
          onPress={this.changeFilterStatus}
        >
          <Text>Filter * </Text>
        </TouchableOpacity>
        {filter}
        {list}
      </View>
    );
  }
}

Browser.propTypes = {
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
  // Add connection to ProfileReducer to get 'Region'
  const { authState, profileState } = state;
  return { authState, profileState };
};

export default connect(mapStateToProps)(Browser);
