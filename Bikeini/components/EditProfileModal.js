
import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, TouchableHighlight, RefreshControl, Alert, Platform, Modal,
} from 'react-native';

const styles = StyleSheet.create({});


export default class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  
  setProfileModalVisible(visible) {
    this.setState({ editProfileModal: visible });
  }

  editProfilePress = () => {
    this.setProfileModalVisible(true);
    // const { navigation } = this.props;
    // navigation.navigate('EditProfile');
  }
  
  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.modalContaner}>
          <View>
            <Text>Edit Profile</Text>

            <TouchableHighlight
              onPress={() => {
                this.setProfileModalVisible(false);
              }}
            >
              <Text>Hide Modal now</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>);
  }
}

const mapStateToProps = (state) => {
  //const { filterState } = state;
  //return { filterState };
};

const mapDispatchToProps = dispatch => (
 // bindActionCreators(
   // { ...filterActions },
    //dispatch,
 // )
);

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileModal);

