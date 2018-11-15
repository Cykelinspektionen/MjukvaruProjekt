import React from 'react';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class ItemCheckbox extends React.Component {
  constructor(props) {
    super(props);

    const { title, id, isChecked } = this.props;
    this.state = {
      isChecked,
      title,
      id,
    };
  }

  changeStatus = () => {
    const { id, isChecked, onChange } = this.state;
    this.setState({ isChecked: !isChecked }, () => {
      this.props.onChange(id);
    });
  }

  render() {
    const { title, isChecked } = this.state;
    return (
      <CheckBox
        title={title}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={isChecked}
        containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
        onPress={this.changeStatus}
      />
    );
  }
}

ItemCheckbox.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
