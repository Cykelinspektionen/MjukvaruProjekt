import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { fetchBikes, fetchBikesSuccess } from '../navigation/actions/BrowserActions';
import Filter from '../components/Filter';
import Item from '../components/Item';
import serverApi from '../utilities/serverApi';

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
  constructor(props) {
    super(props);

    const { browserState } = this.props;

    this.state = {
      showMissing: true,
      missingBicycles: browserState.missingBicycles,
      foundBicycles: browserState.foundBicycles,
      showFilter: false,
      isLoading: false,
      isLoaded: false,
    };
  }

  // Something is wrong...
  // BrowserReducer is called with FETCH_BIKES
  // but the state is not updated?
  componentDidMount() {
    this.props.fetchBikes();
    // this.state.isLoading show be 'true'
    console.log(this.state.isLoading);
  }

  handleServerBicycles = () => {
    const { token } = 'TODO';
    const foundBicycles = [];
    const missingBicycles = [];

    // get(_urlEnd, _contentType, _jwt)
    this.props.dispatch(fetchBikes());
    serverApi.get('bikes/getfoundbikes/', token)
      .then((responseJson) => {
        console.log(responseJson);

        for (let i = 0; i < responseJson.length; i += 1) {
          foundBicycles.push(responseJson[i]);
        }
      }).catch(error => console.log(error));

    serverApi.get('bikes/getstolenbikes/', token)
      .then((responseJson) => {
        console.log(responseJson);

        for (let i = 0; i < responseJson.length; i += 1) {
          missingBicycles.push(responseJson[i]);
        }
      }).catch(error => console.log(error));

    this.setState({ missingBicycles, foundBicycles }, () => {
      this.props.dispatch(fetchBikesSuccess());
    });
  }

  keyExtractor = item => item.key;

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => console.log(`pressed: ${item.description}`)}
    >
      <Item description={item.description} model={item.model} />
    </TouchableOpacity>
  );

  renderHeader = () => {
    const { showMissing } = this.state;
    // const { region } = this.props;      <- TODO, get selected region from user
    if (showMissing) {
      return (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Missing bikes in &#34;region&#34;
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
            Found bikes in &#34;region&#34;
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
      return <Filter />;
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
  browserState: PropTypes.shape({
    showMissing: PropTypes.bool,
    missingBicycles: PropTypes.array,
    foundBicycles: PropTypes.array,
    isLoading: PropTypes.bool,
    isLoaded: PropTypes.bool,
  }),
};

const mapStateToProps = (state) => {
  const { browserState } = state;
  return { browserState };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchBikes,
    fetchBikesSuccess,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
