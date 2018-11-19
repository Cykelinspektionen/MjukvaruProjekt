import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
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

    const { loginState } = this.props;
    const { jwt } = loginState;

    console.log(jwt);
    console.log(jwt);

    this.state = {
      showMissing: true,
      missingBicycles: [],
      foundBicycles: [],
      showFilter: false,
    };

    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.handleServerBicycles();
  }

  handleServerBicycles = () => {
    const { loginState } = this.props;
    const { jwt } = loginState;
    //  let token = jwt[0];
    // Currently using dummy token, use 'jwt' when merging with Client-Side branch!
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZjI5MWQxNzg1N2I1MDAxNmRiNThhOCIsImlhdCI6MTU0MjYzMTAzMiwiZXhwIjoxNTQyNjM0NjMyfQ.xf6jWqsUIB1huih8rZW5HHxg3nvsSeldvgXCVYVxHlo';

    const foundBicycles = [];
    const missingBicycles = [];

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

    this.setState({ missingBicycles, foundBicycles });
  }

  keyExtractor = item => item._id;

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

  search(searchOptions) {
    console.log(searchOptions);
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

const mapStateToProps = (state) => {
  // Add connection to ProfileReducer to get 'Region'
  const { loginState } = state;
  return { loginState };
};

export default connect(mapStateToProps)(Browser);
