import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
    marginLeft: '10%',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  filter: {
    alignSelf: 'flex-start',
    marginTop: '5%',
    marginLeft: '10%',
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
  }
});

class Browser extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showMissing: true,
      bicycles: [
        { key: '1', name: 'Bicycle 1', location: 'Gränby' },
        { key: '2', name: 'Bicycle 2', location: 'Gottsunda' },
        { key: '3', name: 'Bicycle 3', location: 'Stenhagen' },
        { key: '4', name: 'Bicycle 4', location: 'Gränby' },
        { key: '5', name: 'Bicycle 5', location: 'Gottsunda' },
        { key: '6', name: 'Bicycle 6', location: 'Stenhagen' }],
    };
  }

  keyExtractor = item => item.key;

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => console.log('pressed: ' + item.name)}
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
    } else {
      return (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Found bikes in &#34;region&#34;
          </Text>
        </View>
      );
    }
  }

  switchPageType = () => {
    this.setState(prevState => ({
      showMissing: !prevState.showMissing
    }), () => {
      console.log('switch page type');
    });
  }

  render() {
    const { showMissing, bicycles } = this.state;
    let header = this.renderHeader();
    return (
      <View style={styles.container}>
        {header}
        <TouchableOpacity 
          style={styles.showType}
          onPress={this.switchPageType}
          >
        </TouchableOpacity>
        <View style={styles.filter}>
          <Text>Filter * </Text>
        </View>
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
