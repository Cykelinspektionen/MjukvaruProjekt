import React from 'react';
import {
  StyleSheet, View, ListView, TouchableOpacity, Text, TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { changeItems } from '../navigation/actions/FilterActions';
import ItemCheckbox from './ItemCheckbox';

const styles = StyleSheet.create({
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
  },
  searchBar: {
    flexDirection: 'row',
    height: '100%',
    width: '70%',
    marginBottom: '5%',
    borderWidth: 1,
  },
  searchBarIcon: {
    height: '100%',
    width: '10%',
    borderWidth: 1,
    backgroundColor: 'red',
  },
  searchButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: '40%',
    height: '20%',
    backgroundColor: 'blue',
  },
  searchButtonText: {
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  breakLine: {
    width: '100%',
    height: '1%',
    marginTop: '1%',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    height: 30,
    width: '100%',
    backgroundColor: 'red',
  },
  itemContainer: {
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    backgroundColor: 'white',
  },
});

/*
  The 'checkBoxes' state is structured as following array:
  [
    {
      category: 'the name of current category',
      items: [
        {
          category:   {category},
          id:         'index of item in current category',
          isChecked:  'current value of the checkbox, true if checked',
          title:      'the title of the checkbox',
        }
        ,
        ...
      ]
    },
    ...
  ]

  it's an array of JSON objects that consists of a 'category' property and an array 'items' property

  FIND A GOOD WAY OF ONLY RECIEVING THE FILTER ITEMS FROM THE SERVER ONCE!!!
*/

class Filter extends React.Component {
  constructor(props) {
    super(props);

    const { filterState } = this.props;
    this.state = {
      checkBoxes: filterState.checkBoxes,
      categories: filterState.categories,
      searchText: '',
    };

    this.updateCheckBoxes = this.updateCheckBoxes.bind(this);
  }

  search = () => {
    const { checkBoxes, categories, searchText } = this.state;
    let filterOptions = [];
    let categoryOptions = {attributes: []};
    let categoryInd = 0;

    for (let i = 0; i < categories.length; i += 1) {
      const { items, category } = checkBoxes[i];
      categoryOptions.category = category;
      for (let j = 0; j < items.length; j += 1) {
        if(items[j].isChecked) {
          categoryOptions.attributes.push(items[j].title);
        }
      }
      filterOptions.push(categoryOptions);
      categoryOptions = {attributes: []};
    }

    console.log(filterOptions);
  }

  processFilterItems(filterItems) {
    let row = [];
    const processedFilter = [];
    let item1 = {};
    let item2 = {};
    const emptyItem = {
      category: '', id: -1, isChecked: false, title: '',
    };
    const categorySeperator = [emptyItem, emptyItem];

    for (let i = 0; i < filterItems.length; i += 1) {
      const { items, category } = filterItems[i];

      for (let j = 0; j < items.length; j += 2) {
        item1 = items[j];
        item1.category = category;
        item1.id = j;
        row.push(item1);

        if (j + 1 < items.length) {
          item2 = items[j + 1];
          item2.category = category;
          item2.id = j + 1;
          row.push(item2);
        } else {
          // empty checkbox for corrected rendering
          // (e.g only a single checkbox on a row or and
          // empty row to seperate the different categories)
          row.push(emptyItem);
        }

        processedFilter.push(row);
        row = [];
      }
      processedFilter.push(categorySeperator);
    }

    return processedFilter;
  }

  updateCheckBoxes(id, category) {
    const { checkBoxes, categories } = this.state;
    // get index of 'category' from the const 'categories' array
    const categoryInd = categories.indexOf(category);
    checkBoxes[categoryInd].items[id].isChecked = !checkBoxes[categoryInd].items[id].isChecked;

    this.setState({ checkBoxes });
  }

  renderRow(rowData) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.itemContainer}>
          <ItemCheckbox title={rowData[0].title} category={rowData[0].category} id={rowData[0].id} isChecked={rowData[0].isChecked} onChange={this.updateCheckBoxes} />
        </View>
        <View style={styles.itemContainer}>
          <ItemCheckbox title={rowData[1].title} category={rowData[1].category} id={rowData[1].id} isChecked={rowData[1].isChecked} onChange={this.updateCheckBoxes} />
        </View>
      </View>
    );
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const { checkBoxes, searchText } = this.state;
    return (
      <View style={styles.fullContainter}>
        <View style={styles.container}>
          <View style={{
            flexDirection: 'row', width: '100%', height: '10%', marginBottom: '5%',
          }}
          >
            <TextInput
              style={styles.searchBar}
              onChangeText={text => this.setState({ searchText: text })}
              value={searchText}
            />
            <View style={styles.searchBarIcon} />
          </View>
          <ListView
            dataSource={
              ds.cloneWithRows(this.processFilterItems(checkBoxes))
              }
            renderRow={rowData => this.renderRow(rowData)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={this.search}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.breakLine} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { filterState } = state;
  return { filterState };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    changeItems,
  }, dispatch)
);

Filter.propTypes = {
  filterState: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
