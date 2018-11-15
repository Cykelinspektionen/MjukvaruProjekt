import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, CheckBox, ListView
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const stylesFilter = StyleSheet.create({
  fullContainter: {
    width: '100%',
    height: '50%',
    marginTop: '2%',
  },
  container: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    width: '80%',
    height: '100%',
    marginLeft: '10%',
    borderWidth: 1,
  },
  searchBar: {
    height: '10%',
    width: '70%',
    borderWidth: 1,
  },
  breakLine: {
    width: '100%',
    height: '1%',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  boxPanel: {
    flexDirection: 'row',
    marginTop: '5%',
    width: '100%'
  },
  rowContainer: {
    flexDirection: 'row',
    height: 50,
    width: 500,
    backgroundColor: 'red',
    borderWidth: 1
  },
  itemContainer: {
    width: '50%',
    borderWidth: 1
  },
  itemText: {
    fontSize: 22,
  }
});


const filterItems = [
  'row 1', 'row 1-2', 
  'row 2', 'row 2-2'
]

class Filter extends React.PureComponent {

  constructor(props) {
    super(props);

    /*
    checked: false,
    checked2: false
    */
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //{a:'row 1', b:'row 1-2'}, {a:'row 2', b:'row 2-2'}
    this.state = {
      dataSource: ds.cloneWithRows([['row 1', 'row 1-2'], ['row 2', 'row 2-2']]),
      checked: false,
      checked2: false,
    };
  }

  renderRow(rowData) {
    return (
      <View style={stylesFilter.rowContainer}>
        <View style={stylesFilter.itemContainer}>
          <CheckBox 
              title='Click Here'
              value={this.state.checked}
              onChange={() => this.setState({checked: !this.state.checked})}
            />
          <Text style={stylesFilter.itemText}>{filterItems[0]}</Text>
        </View>
      </View>

    );
  }

  /*
          <View style={stylesFilter.boxPanel}>
            <CheckBox 
              title='Click Here'
              value={this.state.checked}
              onChange={() => this.setState({checked: !this.state.checked})}
            />
            <CheckBox 
              title='Click Here'
              value={this.state.checked2}
              onChange={() => this.setState({checked2: !this.state.checked2})}
            />
          </View>
  */
  render() {
    return (
      <View style={stylesFilter.fullContainter}>
        <View style={stylesFilter.container}>
          <View style={stylesFilter.searchBar} />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />
        </View>
        <View style={stylesFilter.breakLine} />
      </View>
    );
  }
}

const stylesItem = StyleSheet.create({
  item: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    height: 100,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  image: {
    alignSelf: 'center',
    width: '20%',
    height: '80%',
    marginLeft: '3%',
    backgroundColor: 'blue',
  },
  textView: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: '5%',
    marginLeft: '5%',
  },
  description: {
    fontSize: 18,
    fontWeight: '400',
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
  },
  commentsTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 25,
    right: '5%',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  locationTag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 25,
    height: 25,
    right: '13%',
    backgroundColor: 'black',
  },
});

class Item extends React.PureComponent {
  render() {
    const { name, location } = this.props;
    return (
      <View style={stylesItem.item}>
        <View style={stylesItem.image} />
        <View style={stylesItem.textView}>
          <Text style={stylesItem.description}>
            {name}
          </Text>
          <Text style={stylesItem.location}>
            {location}
          </Text>
        </View>
        <View style={stylesItem.commentsTag} />
        <View style={stylesItem.locationTag} />
      </View>
    );
  }
}

Item.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

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

class Browser extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showMissing: true,
      bicycles: missingBicycles,
      showFilter: false,
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

    if(showFilter) {
      return <Filter />;
    }
    else {
      return;
    }
  }

  render() {
    const { bicycles, showFilter } = this.state;
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
          onPress={() => this.setState({showFilter: !this.state.showFilter})}
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
