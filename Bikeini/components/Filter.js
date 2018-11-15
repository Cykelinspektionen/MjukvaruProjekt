import React from 'react';
import {
  StyleSheet, View, ListView,
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

class Filter extends React.Component {
  constructor(props) {
    super(props);

    const { filterState } = this.props;
    this.state = {
      checkBoxes: filterState.checkBoxes,
    };

    this.updateCheckBoxes = this.updateCheckBoxes.bind(this);
  }

  updateCheckBoxes(id) {
    const { checkBoxes } = this.state;
    checkBoxes[id].isChecked = !checkBoxes[id].isChecked;

    this.setState({ checkBoxes });
  }

  processFilterItems(items) {
    let row = [];
    const processedFilter = [];
    for (let i = 0; i < items.length; i += 2) {
      row.push(items[i]);
      row.push(items[i + 1]);

      processedFilter.push(row);
      row = [];
    }
    return processedFilter;
  }

  renderRow(rowData) {
    // return <ItemCheckbox />;

    const id1 = rowData[0].id;
    const text1 = rowData[0].title;
    const checked1 = rowData[0].isChecked;
    const id2 = rowData[1].id;
    const text2 = rowData[1].title;
    const checked2 = rowData[1].isChecked;
    return (
      <View style={styles.rowContainer}>
        <View style={styles.itemContainer}>
          <ItemCheckbox title={text1} id={id1} isChecked={checked1} onChange={this.updateCheckBoxes} />
        </View>
        <View style={styles.itemContainer}>
          <ItemCheckbox title={text2} id={id2} isChecked={checked2} onChange={this.updateCheckBoxes} />
        </View>
      </View>
    );
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const { checkBoxes } = this.state;
    return (
      <View style={styles.fullContainter}>
        <View style={styles.container}>
          <View style={styles.searchBar} />
          <ListView
            dataSource={
              ds.cloneWithRows(this.processFilterItems(checkBoxes))
              }
            renderRow={rowData => this.renderRow(rowData)}
          />
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
