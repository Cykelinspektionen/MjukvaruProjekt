import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableHighlight, TextInput, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import RadioGroup from 'react-native-radio-buttons-group';
import { Dropdown } from 'react-native-material-dropdown';
import { ImagePicker, ImageManipulator } from 'expo';
import permissions from '../utilities/permissions';
import * as addBikeActions from '../navigation/actions/AddBikeActions';


const defaultBike = require('../assets/images/robot-dev.png');
const cameraImg = require('../assets/images/albumImage.png');
const albumImg = require('../assets/images/camera.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdowns: {
    width: 250,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  smallButtonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 150,
    borderRadius: 5,
  },
  actionButton: {
    backgroundColor: '#00b5ec',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  icons: {
    width: 25,
    height: 25,
  },
});

class AddBike extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraRollPermission: null,
      Title: '',
      savedImgRef:'',
      Type: [
        {
          label: 'Stolen',
          value: 'Stolen',
        },
        {
          label: 'Found',
          value: 'Found',
        },
      ],
      Color: [
        {
          value: 'Red',
        },
        {
          value: 'Not Red',
        },
      ],
      // Change to text input??
      Brand: [
        {
          value: 'Monark',
        },
        {
          value: 'Budget',
        },
      ],
      // Temporary, details i suspect will be given later
      Size: [
        {
          value: 'Small',
        },
        {
          value: 'Freaking Huge',
        },
      ],
    };
    this.cameraRollPermission = permissions.cameraRollPermission.bind(this);
  }

  typeRadio = Type => this.setState({ Type });

  startCameraRoll = () => {
    this.cameraRollPermission(this.pickImage);
  }

  pickImage = async () => {
    const { hasCameraRollPermission } = this.state;
    if (!hasCameraRollPermission) {
      Alert.alert('No Access');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      const { saveImageToState } = this.props;
      saveImageToState(result.uri);
      console.log(this.props);
    }
  };

  render() {
    const { addBikeState, navigation } = this.props;
    const {
      Title, Type, Color, Brand, Size,
    } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          Add a picture of your bike
        </Text>
        <View style={styles.rowContainer}>
          <View>
            {!addBikeState.uriSet && <Image source={defaultBike} /> }
            {addBikeState.uriSet && <Image source={{ uri: addBikeState.imgToUploadUri }} style={styles.thumbnail} />}
          </View>
          <View>
            <View style={styles.rowContainer}>
              <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton]} onPress={this.startCameraRoll}>
                <Text style={styles.loginText}>ADD FROM ALBUM</Text>
              </TouchableHighlight>
              <Image
                style={styles.icons}
                source={cameraImg}
              />
            </View>
            <View style={styles.rowContainer}>
              <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton]} onPress={() => navigation.navigate('Camera')}>
                <Text style={styles.loginText}>TAKE A PHOTO</Text>
              </TouchableHighlight>
              <Image
                style={styles.icons}
                source={albumImg}
              />
            </View>
          </View>
        </View>
        <TextInput
          style={styles.inputs}
          placeholder="Title"
          underlineColorAndroid="transparent"
          value={Title}
          onChangeText={text => this.setState({ Title: text })}
        />
        <RadioGroup
          radioButtons={Type}
          onPress={this.typeRadio}
          flexDirection="row"
        />
        <View style={styles.dropdowns}>
          <Dropdown
            label="Color"
            data={Color}
          />
          <Dropdown
            label="Brand"
            data={Brand}
          />
          <Dropdown
            label="Size"
            data={Size}
          />
        </View>
        <TouchableHighlight
          style={[styles.smallButtonContainer, styles.actionButton]}
          onPress={() => {
            // API CALL TO SAVE IMG, STORE RESPONSE IN saveImgRef
            // API CALL TO SAVE STATE
            const stolen = Type[0].selected;
            if (stolen) {
              // SET PREVIEW STATE TO SHOW STOLEN
            } else {
              // SET PREVIEW STATE TO SHOW FOUND
            }
            // navigation.navigate('PREVIEW ADS!')
          }}
        >
          <Text style={styles.loginText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

AddBike.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  addBikeState: PropTypes.shape({
    newBikeID: PropTypes.string.isRequired,
    imgToUploadUri: PropTypes.string.isRequired,
  }).isRequired,
  saveImageToState: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { addBikeState } = state;
  return { addBikeState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...addBikeActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(AddBike);
