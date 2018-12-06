import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableHighlight, TextInput, Alert, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import RadioGroup from 'react-native-radio-buttons-group';
import { Dropdown } from 'react-native-material-dropdown';
import { ImagePicker, ImageManipulator } from 'expo';
import permissions from '../utilities/permissions';
import headerStyle from './header';

import * as addBikeActions from '../navigation/actions/AddBikeActions';


const defaultBike = require('../assets/images/robot-dev.png');
const cameraImg = require('../assets/images/albumImage.png');
const albumImg = require('../assets/images/camera.png');

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: '2%',
    marginBottom: 100,
  },
  dropdowns: {
    width: '90%',
    marginLeft: '4%',
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
  buttonDisabled: {
    opacity: 0.2,
  },
  actionButton: {
    backgroundColor: '#00b5ec',
  },
  inputs: {
    height: '4%',
    width: '90%',
    marginLeft: '4%',
    marginBottom: '1%',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
  thumbnail: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
  },
  icons: {
    width: '20%',
    height: '60%',
    marginLeft: '2%',
    left: '75%',
  },
  addPhotoButtons: {
    left: '20%',
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
  },
  headerText: {
    fontSize: 18,
    margin: '2%',
    fontWeight: 'bold',
  },
  uploadPhotoButton: {
    flex: 1,
    alignSelf: 'center',
    width: '70%',
  },
  submitButton: {
    alignSelf: 'flex-end',
    marginRight: '4%',
  },
  radio: {
    alignItems: 'flex-start',
    marginLeft: '15%',
  },
});

class AddBike extends React.Component {
  static navigationOptions = {
    ...headerStyle,
  };

  constructor() {
    super();
    this.state = {
      hasCameraRollPermission: null,
      bikeData: {
        type: 'STOLEN',
        title: '',
        brand: '',
        model: '',
        color: '',
        frame_number: 0,
        antitheft_code: '',
        description: '',
        lat: 40.714224,
        long: -73.961452,
        keywords: {
          frame_type: 'MALE',
          child: false,
          sport: true,
          tandem: false,
          basket: true,
          rack: true,
          mudguard: true,
          chain_protection: true,
          net: true,
          winter_tires: true,
          light: true,
        },
      },
      radios: {
        type: [
          {
            label: 'Stolen',
            value: 'STOLEN',
          },
          {
            label: 'Found',
            value: 'FOUND',
          },
        ],
        frame_type: [
          {
            label: 'Male',
            value: 'MALE',
          },
          {
            label: 'Female',
            value: 'FEMALE',
          },
        ],

        child: [
          {
            label: 'Adult',
            value: 2,
          },
          {
            label: 'Child',
            value: 1,
          },
        ],

        sport: [
          {
            label: 'Sport',
            value: 1,
          },
          {
            label: 'Casual',
            value: 2,
          },
        ],
        tandem: [
          {
            label: 'Single',
            value: 2,
          },
          {
            label: 'Tandem',
            value: 1,
          },
        ],
        rack: [
          {
            label: 'Rack',
            value: 1,
          },
          {
            label: 'No Rack',
            value: 2,
          },
        ],
        basket: [
          {
            label: 'Basket',
            value: 1,
          },
          {
            label: 'No Basket',
            value: 2,
          },
        ],
        mudguard: [
          {
            label: 'Mudguard',
            value: 1,
          },
          {
            label: 'No Mudguard',
            value: 2,
          },
        ],
        chainProtection: [
          {
            label: 'Chain protector',
            value: 1,
          },
          {
            label: 'No chain protector',
            value: 2,
          },
        ],
        net: [
          {
            label: 'Net',
            value: 1,
          },
          {
            label: 'No Net',
            value: 2,
          },
        ],
        winterTires: [
          {
            label: 'Winter Tires',
            value: 1,
          },
          {
            label: 'Summer Tires',
            value: 2,
          },
        ],
        light: [
          {
            label: 'Light',
            value: 1,
          },
          {
            label: 'No Light',
            value: 2,
          },
        ],
      },
      Color: [
        {
          value: 'Red',
        },
        {
          value: 'Green',
        },
        {
          value: 'Blue',
        },
        {
          value: 'White',
        },
        {
          value: 'Black',
        },
      ],
    };
    this.cameraRollPermission = permissions.cameraRollPermission.bind(this);
  }

  componentDidUpdate() {
    const { addBikeState, navigation, setBikePosted } = this.props;
    if (addBikeState.bikePosted) {
      setBikePosted(false);
      navigation.navigate('Browser');
    }
  }

  setServerResponse(response, radioCallback, colorCallback) {
    console.log(response); // <- Used for checking the structure of the ML-response, please leave it until it's been testsed on live! :)
    const { radios } = this.state;

    // For this to work the response from the server CAN'T have any nestled attrbiutes!
    Object.keys(response).forEach((key) => {
      if (key === 'lamp') {
        // Has to be left in until back-end changes the key "lamp" to "light"!
        key = 'light';
      }
      let data = radios[key];
      if (key === 'frame') {
        let frameKey = response[key];
        switch (frameKey) {
          case 'sport':
            data = radios[frameKey];
            data[0].selected = true;
            data[1].selected = false;
            radioCallback(data, frameKey, true, true);
            break;
          case 'male':
            frameKey = 'frame_type';
            data = radios[frameKey];
            data[0].selected = true;
            data[1].selected = false;
            radioCallback(data, frameKey, true, 'MALE');
            break;
          case 'female':
            frameKey = 'frame_type';
            data = radios[frameKey];
            data[0].selected = false;
            data[1].selected = true;
            radioCallback(data, frameKey, true, 'FEMALE');
            break;
          default:
            console.log(`Unknown key: ${frameKey}`);
            break;
        }
      } else if (key === 'bikeFound') {
        if (!response[key]) {
          console.log('There was NOT a bike in the picture!');
        }
      } else if (!response[key]) {
        data[0].selected = false;
        data[1].selected = true;
        radioCallback(data, key, true, false);
      } else if (response[key] && key !== 'color') {
        data[0].selected = true;
        data[1].selected = false;
        radioCallback(data, key, true, true);
      } else if (key === 'color') {
        colorCallback('color', response[key]);
      }
    });
  }

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
    }
  };

  setBikeData = (attr, value, setKeyword) => {
    const { bikeData } = this.state;
    if (setKeyword) {
      const { keywords } = bikeData;
      if (value === 1 || value === 2) {
        keywords[attr] = Boolean(value);
      } else {
        keywords[attr] = value;
      }
    } else {
      bikeData[attr] = value;
    }
    this.setState({ bikeData });
  }

  radioUpdater = (change, name, head, response) => {
    const { radios } = this.state;
    const selectedButton = radios[name].find(e => e.selected === true);
    if (response != null) {
      this.setBikeData(name, response, head);
    } else {
      this.setBikeData(name, selectedButton.value, head);
    }
    radios[name] = change;
    this.setState({ radios });
  }

  compressUri = async (imgUri) => {
    try {
      const compressedUri = await ImageManipulator.manipulateAsync(
        imgUri,
        [{ resize: { width: 250, height: 250 } }],
        {
          compress: 1,
          format: 'jpeg',
        },
      );
      return compressedUri;
    } catch (err) {
      console.log(err);
    }
    return imgUri;
  }

  render() {
    const {
      authState, addBikeState, navigation, uploadBikeToServer, imgUploadInit,
    } = this.props;
    const {
      bikeData, radios, Color,
    } = this.state;
    const {
      color,
    } = bikeData;
    if (addBikeState.uploadingBike) {
      return (
        <View style={styles.container}>
          <Text>Posting Ad...</Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.headerText}>
          Add a picture of your bike
          </Text>
          <View style={styles.rowContainer}>
            <View>
              {!addBikeState.uriSet && <Image source={defaultBike} /> }
              {addBikeState.uriSet && <Image source={{ uri: addBikeState.imgToUploadUri }} style={styles.thumbnail} />}
            </View>
            <View>
              <View style={styles.rowContainer}>
                <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton, styles.addPhotoButtons]} onPress={this.startCameraRoll}>
                  <Text style={styles.greenButtonText}>ADD FROM ALBUM</Text>
                </TouchableHighlight>
                <Image
                  style={styles.icons}
                  source={cameraImg}
                />
              </View>
              <View style={styles.rowContainer}>
                <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton, styles.addPhotoButtons]} onPress={() => navigation.navigate('Camera')}>
                  <Text style={styles.greenButtonText}>TAKE A PHOTO</Text>
                </TouchableHighlight>
                <Image
                  style={styles.icons}
                  source={albumImg}
                />
              </View>
            </View>
          </View>
          <TouchableHighlight
            style={[
              styles.smallButtonContainer,
              styles.actionButton,
              styles.greenButton,
              styles.uploadPhotoButton,
              !addBikeState.uploadDisabled ? [] : [styles.buttonDisabled],
            ]}
            disabled={addBikeState.uploadDisabled}
            onPress={() => {
              this.compressUri(addBikeState.imgToUploadUri).then((compressedUri) => {
                imgUploadInit(compressedUri.uri, bikeData.type, authState.jwt[0])
                  .then(response => this.setServerResponse(response, this.radioUpdater, this.setBikeData));
              });
            }
            }
          >
            <Text style={styles.greenButtonText}>UPLOAD IMAGE</Text>
          </TouchableHighlight>
          <View style={styles.radio}>
            <RadioGroup
              horizontal="true"
              radioButtons={radios.type}
              onPress={(data) => { this.radioUpdater(data, 'type'); }}
              flexDirection="row"
            />
            <RadioGroup
              horizontal="true"
              radioButtons={radios.frame_type}
              onPress={(data) => { this.radioUpdater(data, 'frame_type', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.child}
              onPress={(data) => { this.radioUpdater(data, 'child', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.sport}
              onPress={(data) => { this.radioUpdater(data, 'sport', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.tandem}
              onPress={(data) => { this.radioUpdater(data, 'tandem', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.basket}
              onPress={(data) => { this.radioUpdater(data, 'basket', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.rack}
              onPress={(data) => { this.radioUpdater(data, 'rack', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.mudguard}
              onPress={(data) => { this.radioUpdater(data, 'mudguard', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.chainProtection}
              onPress={(data) => { this.radioUpdater(data, 'chainProtection', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.net}
              onPress={(data) => { this.radioUpdater(data, 'net', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.winterTires}
              onPress={(data) => { this.radioUpdater(data, 'winterTires', true); }}
              flexDirection="row"
            />
            <RadioGroup
              radioButtons={radios.light}
              onPress={(data) => { this.radioUpdater(data, 'light', true); }}
              flexDirection="row"
            />
          </View>
          <View style={styles.dropdowns}>
            <Dropdown
              value={color}
              label="Color"
              data={Color}
              onChangeText={value => this.setBikeData('color', value)}
            />
          </View>
          <TextInput
            style={styles.inputs}
            placeholder="Frame number"
            underlineColorAndroid="transparent"
            value={bikeData.frameNumber}
            onChangeText={text => this.setBikeData('frameNumber', text)}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Anti Theft Code"
            underlineColorAndroid="transparent"
            value={bikeData.antiTheftCode}
            onChangeText={text => this.setBikeData('antiTheftCode', text)}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Brand"
            underlineColorAndroid="transparent"
            value={bikeData.brand}
            onChangeText={text => this.setBikeData('brand', text)}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Model"
            underlineColorAndroid="transparent"
            value={bikeData.model}
            onChangeText={text => this.setBikeData('model', text)}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Title"
            underlineColorAndroid="transparent"
            value={bikeData.title}
            onChangeText={text => this.setBikeData('title', text)}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Description"
            underlineColorAndroid="transparent"
            value={bikeData.description}
            onChangeText={text => this.setBikeData('description', text)}
          />
          <TouchableHighlight
            style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton, styles.submitButton]}
            onPress={() => {
              if (!addBikeState.uriSet) {
                Alert.alert('Picture is mandatory!');
                return;
              }
              uploadBikeToServer(addBikeState.imgToUploadUri, bikeData, authState.jwt[0]);
            }
            }
          >
            <Text style={styles.greenButtonText}>SUBMIT</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

AddBike.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  addBikeState: PropTypes.shape({
    imgToUploadUri: PropTypes.string.isRequired,
    bikePosted: PropTypes.bool.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
  imgUploadInit: PropTypes.func.isRequired,
  uploadBikeToServer: PropTypes.func.isRequired,
  setBikePosted: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { addBikeState, authState } = state;
  return { addBikeState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...addBikeActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(AddBike);
