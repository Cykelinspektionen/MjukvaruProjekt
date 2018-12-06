import React from 'react';
import {
  StyleSheet, View, TouchableOpacity, Text, TextInput, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { changeItems } from '../navigation/actions/FilterActions';
import ItemCheckbox from './ItemCheckbox';

const styles = StyleSheet.create({
  fullContainter: {
    width: '100%',
    height: '65%',
    marginTop: '2%',
  },
  container: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    width: '80%',
    marginLeft: '10%',
  },
  searchBar: {
    flexDirection: 'row',
    height: '100%',
    width: '70%',
    marginBottom: '5%',
    borderWidth: 1,
  },
  searchButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#44ccad',
  },
  searchButtonText: {
    textAlignVertical: 'center',
    fontSize: 24,
    fontWeight: '100',
    color: 'white',
  },
  inputs: {
    height: '7%',
    flex: 1,
    marginBottom: '5%',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
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
 * THE STRUCTURE FOR FILTER IS IN BETA - WILL PROBABLY BE CHANGED LATER WHEN THE TIME IS RIGHT!
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
      searchOptions: {
        frameNumber: '',
        antiTheftCode: '',
        brand: '',
        model: '',
        color: '',
      },
    };

    this.updateCheckBoxes = this.updateCheckBoxes.bind(this);
  }

  setSearchText(type, text) {
    const { searchOptions } = this.state;
    searchOptions[type] = text;

    this.setState({ searchOptions });
  }

  search = () => {
    const { checkBoxes, categories, searchOptions } = this.state;
    const {
      frameNumber, antiTheftCode, brand, model, color,
    } = searchOptions;
    const filterOptions = {};

    for (let i = 0; i < categories.length; i += 1) {
      const { items } = checkBoxes[i];
      for (let j = 0; j < items.length; j += 1) {
        if (items[j].isChecked) {
          filterOptions[items[j].data] = true;
        }
      }
    }

    if (frameNumber !== '') {
      filterOptions.frame_number = frameNumber;
    }
    if (antiTheftCode !== '') {
      filterOptions.antitheft_code = antiTheftCode;
    }
    if (brand !== '') {
      filterOptions.brand = brand;
    }
    if (model !== '') {
      filterOptions.model = model;
    }
    if (color !== '') {
      filterOptions.color = color;
    }

    this.props.search(filterOptions);
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

  renderFilterOptions = () => {
    const { checkBoxes } = this.state;
    const processedFilter = this.processFilterItems(checkBoxes);
    const filterOptions = {};

    for (let i = 0; i < processedFilter.length; i += 1) {
      filterOptions.push(this.renderRow(processedFilter[i]));
    }

    return filterOptions;
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
      <View style={styles.rowContainer} key={Math.random() * 10000}>
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
    const { checkBoxes, searchOptions } = this.state;
    const processedFilter = this.processFilterItems(checkBoxes);
    return (
      <View style={styles.fullContainter}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ marginBottom: 100 }}>
            {processedFilter.map(rowData => this.renderRow(rowData))}
            <TextInput
              style={styles.inputs}
              placeholder="Frame number"
              value={searchOptions.frameNumber}
              onChangeText={text => this.setSearchText('frameNumber', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Anti Theft Code"
              value={searchOptions.antiTheftCode}
              onChangeText={text => this.setSearchText('antiTheftCode', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Brand"
              value={searchOptions.brand}
              onChangeText={text => this.setSearchText('brand', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Model"
              value={searchOptions.model}
              onChangeText={text => this.setSearchText('model', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Color"
              value={searchOptions.color}
              onChangeText={text => this.setSearchText('color', text)}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={this.search}
            >
              <Text style={styles.searchButtonText}>SEARCH</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  search: PropTypes.func.isRequired,
  filterState: PropTypes.shape({
    checkBoxes: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
