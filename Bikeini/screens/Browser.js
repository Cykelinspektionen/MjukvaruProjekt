import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

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
  },
  headerText: {
    fontSize: 22,
    fontWeight: '300',
  },
  filter: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginTop: '5%',
    marginLeft: '13%',
  },
  browserList: {
    flex: 1,
    alignSelf: 'flex-start',
    marginTop: '1%',
    marginLeft: '10%',
    width: '88%',
  },
  showTypeLeft: {
    alignSelf: 'flex-start',
    position: 'relative',
    marginTop: '1%',
    left: 10,
  },
  showTypeRight: {
    alignSelf: 'flex-end',
    position: 'relative',
    marginTop: '1%',
    right: 10,
  },
  breakLine: {
    width: '100%',
    height: '1%',
    marginTop: '1%',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
});

class Browser extends React.Component {
  static navigationOptions = {
    ...headerStyle,
  };

  constructor() {
    super();

    this.state = {
      showMissing: true,
      missingBicycles: '',
      foundBicycles: '',
      showFilter: false,
      isFetching: false,
    };
  }

  componentDidMount() {
    this.handleServerBicycles();
  }

  handleServerBicycles = () => {
    const { authState, profileState } = this.props;
    const { jwt } = authState;
    const { location } = profileState;

    let formData = `type=FOUND&location.city=${location}`;

    serverApi.fetchApi('bikes/filterbikes', formData, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        this.setState({ foundBicycles: responseJson.message });
      }).catch(error => console.log(error));

    formData = `type=STOLEN&location.city=${location}`;

    serverApi.fetchApi('bikes/filterbikes', formData, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        this.setState({ missingBicycles: responseJson.message });
      }).catch(error => console.log(error));
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  };

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    const bikeData = item;
    bikeData.showComments = true;// true = shows comments , false = shows similar bikes!
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BikeInformation', { data: bikeData });
        }}
      >
        <Item description={item.description || ''} model={item.model || ''} imageUrl={item.image_url || ''} />
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

  onRefresh = () => {
    this.setState({ isFetching: true }, () => {
      this.handleServerBicycles();
    });
  }

  renderList = () => {
    const {
      showMissing, missingBicycles, foundBicycles, isFetching,
    } = this.state;

    if (showMissing) {
      return (
        <View style={styles.browserList}>
          <FlatList
            data={missingBicycles}
            onRefresh={this.onRefresh}
            refreshing={isFetching}
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

  renderSwitchType = () => {
    const { showMissing } = this.state;

    if (showMissing) {
      return (
        <TouchableOpacity
          style={styles.showTypeRight}
          onPress={this.switchPageType}
        >
          <Icon name={Platform.OS === 'ios' ? 'ios-arrow-dropright' : 'md-arrow-dropright'} size={80} color="black" />
        </TouchableOpacity>
      );
    }


    return (
      <TouchableOpacity
        style={styles.showTypeLeft}
        onPress={this.switchPageType}
      >
        <Icon name={Platform.OS === 'ios' ? 'ios-arrow-dropleft' : 'md-arrow-dropleft'} size={80} color="black" />
      </TouchableOpacity>
    );
  }

  renderFilterHeader = () => {
    const { showFilter } = this.state;

    if (showFilter) {
      return (
        <TouchableOpacity
          style={styles.filter}
          onPress={this.changeFilterStatus}
        >
          <Text style={{ fontSize: 16 }}>Filter  </Text>
          <Icon name="md-arrow-dropup" size={30} color="black" />
        </TouchableOpacity>
      );
    }


    return (
      <TouchableOpacity
        style={styles.filter}
        onPress={this.changeFilterStatus}
      >
        <Text style={{ fontSize: 16 }}>Filter  </Text>
        <Icon name="md-arrow-dropdown" size={30} color="black" />
      </TouchableOpacity>
    );
  }

  changeFilterStatus = () => {
    const { showFilter } = this.state;

    this.setState({ showFilter: !showFilter });
  }


  search = (searchOptions) => {
    console.log(searchOptions);
  }

  render() {
    const header = this.renderHeader();
    const filterHeader = this.renderFilterHeader();
    const filter = this.renderFilter();
    const list = this.renderList();
    const switchArrow = this.renderSwitchType();
    return (
      <View style={styles.container}>
        {header}
        {switchArrow}
        {filterHeader}
        <View style={styles.breakLine} />
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
    error: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

export default connect(mapStateToProps)(Browser);
