import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Filter from '../components/Filter';
import Item from '../components/Item';

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

    this.state = {
      showMissing: true,
      bicycles: missingBicycles,
      showFilter: true,
    };
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

  changeFilterStatus = () => {
    const { showFilter } = this.state;

    this.setState({ showFilter: !showFilter });
  }

  render() {
    const { bicycles } = this.state;
    const header = this.renderHeader();
    const filter = this.renderFilter();
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
        <View style={styles.browserList}>
          <FlatList
            data={bicycles}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { loginState } = state;
  return { loginState };
};

export default connect(mapStateToProps)(Browser);
