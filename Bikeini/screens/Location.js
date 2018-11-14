import React from 'react';
import {
  StyleSheet, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { CheckBox } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
      },
});

const items = ['Stockholm', 'Uppsala', 'Göteborg'];

async function readFile() {
  const fileContents = await FileSystem.readFile('../Locations.txt');
  console.log(`read from file: ${fileContents}`);
}

class Location extends React.PureComponent {
state = {
  checked: [],
};

checkItem = item => {
  const { checked } = this.state;
  if (!checked.includes(item)) {
    this.setState({ checked: [...checked, item] });
  } else {
    this.setState({ checked: checked.filter(a => a !== item) });
  }
};

render() {
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        extraData={this.state}
        renderItem={({ item }) => (
          <CheckBox
            title={item}
            onPress={() => this.checkItem(item)}
            checked={this.state.checked.includes(item)}
          />
        )}
      />
    </View>
  );
}
}

Location.propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };
  
  const mapStateToProps = (state) => {
    const { locationState } = state;
    return { locationState };
  };
  
  export default connect(mapStateToProps)(Location);
  