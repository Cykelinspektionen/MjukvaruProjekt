import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { fetchBikes } from '../navigation/actions/BrowserActions';
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

const missingBicycles = [
  { key: '1', name: 'Bicycle 1', location: 'Gränby' },
  { key: '2', name: 'Bicycle 2', location: 'Gottsunda' },
  { key: '3', name: 'Bicycle 3', location: 'Stenhagen' },
  { key: '4', name: 'Bicycle 4', location: 'Gränby' },
  { key: '5', name: 'Bicycle 5', location: 'Gottsunda' },
  { key: '6', name: 'Bicycle 6', location: 'Stenhagen' }];

const foundBicycles = [
  { key: '11', name: 'Bicycle 11', location: 'Sunnersta' },
  { key: '12', name: 'Bicycle 12', location: 'Valsätra' },
  { key: '13', name: 'Bicycle 13', location: 'Norby' },
  { key: '14', name: 'Bicycle 14', location: 'Luthagen' }];

class Browser extends React.Component {
  constructor(props) {
    super(props);

    const { browserState } = this.props;
    this.state = {
      showMissing: true,
      missingBicycles: browserState.missingBicycles,
      foundBicycles: browserState.foundBicycles,
      showFilter: false,
    };
  }

  componentDidMount() {
    const { fetchBikes } = this.props;

    //weird issue here ):
    //fetchBikes();
    
    /*serverApi.get('bikes/getfoundbikes/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZWQ3ODkzZDYwZDhmMDAxNjdhZWY5OSIsImlhdCI6MTU0MjM3ODg4NywiZXhwIjoxNTQyMzgyNDg3fQ.rOx6nX-5sykfbIkdaNGBPc62B3X35gItF-mWG2dFgSU')
      .then((responseJson) => {
        // Check for failure!
        console.log(responseJson);
        //deviceStorage.saveItem('id_token', responseJson.jwt);
        //login(jwt);
        //navigation.navigate('TempPage');
      }).catch(error => console.log(error));*/
  }

  keyExtractor = item => item.key;

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => console.log(`pressed: ${item.name}`)}
    >
      <Item name={item.name} location={item.location} />
    </TouchableOpacity>
  );

  renderHeader = () => {
    const { showMissing } = this.state;
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
    }), () => {
      const { showMissing } = this.state;
      if (showMissing) {
        this.setState({ bicycles: missingBicycles });
      } else {
        this.setState({ bicycles: foundBicycles });
      }
    });
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

    if(showMissing) {
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

    else {
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
  }

  changeFilterStatus = () => {
    const { showFilter } = this.state;

    this.setState({ showFilter: !showFilter });
  }

  render() {
    const { bicycles, showMissing } = this.state;
    const header = this.renderHeader();
    const filter = this.renderFilter();
    const list = this.renderList();

    let bicyclesShown = [];

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

const mapStateToProps = (state) => {
  const { browserState } = state;
  return { browserState };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchBikes,
  }, dispatch)
);

export default connect(mapStateToProps)(Browser);
