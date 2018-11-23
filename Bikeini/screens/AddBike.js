import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableHighlight, TextInput, Alert, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import RadioGroup from 'react-native-radio-buttons-group';
import { Dropdown } from 'react-native-material-dropdown';
import { ImagePicker } from 'expo';
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
  buttonDisabled: {
    opacity: 0.2,
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
    width: 30,
    height: 30,
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
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
        location: {
          Lat: 0,
          Long: 0,
        },
        keywords: {
          frameType: 'MALE',
          child: false,
          sport: false,
          tandem: false,
          basket: false,
          rack: false,
          mudguard: false,
          chain_protection: false,
          net: false,
          winter_tires: false,
          light: false,
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
        frameType: [
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
          value: 'Not Red',
        },
      ],
    };
    this.cameraRollPermission = permissions.cameraRollPermission.bind(this);
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

  radioUpdater = (change, name, head) => {
    const { radios } = this.state;
    const selectedButton = radios[name].find(e => e.selected === true);
    this.setBikeData(name, selectedButton.value, head);
    radios[name] = change;
    this.setState({ radios });
  }

  render() {
    const {
      authState, addBikeState, navigation, uploadBikeToServer, imgUploadInit,
    } = this.props;
    const {
      bikeData, radios, Color,
    } = this.state;
    return (
      <ScrollView style={styles.background}>
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
                <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton]} onPress={this.startCameraRoll}>
                  <Text style={styles.greenButtonText}>ADD FROM ALBUM</Text>
                </TouchableHighlight>
                <Image
                  style={styles.icons}
                  source={cameraImg}
                />
              </View>
              <View style={styles.rowContainer}>
                <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton]} onPress={() => navigation.navigate('Camera')}>
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
              !addBikeState.uploadDisabled ? [] : [styles.buttonDisabled],
            ]}
            disabled={addBikeState.uploadDisabled}
            onPress={() => imgUploadInit(addBikeState.imgToUploadUri, bikeData.type, authState.jwt[0])}
          >
            <Text style={styles.greenButtonText}>UPLOAD IMAGE</Text>
          </TouchableHighlight>
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
            value={bikeData.description}
            onChangeText={text => this.setBikeData('brand', text)}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Model"
            underlineColorAndroid="transparent"
            value={bikeData.description}
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
          <RadioGroup
            radioButtons={radios.type}
            onPress={(data) => { this.radioUpdater(data, 'type'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.frameType}
            onPress={(data) => { this.radioUpdater(data, 'frameType', true); }}
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
          <View style={styles.dropdowns}>
            <Dropdown
              label="Color"
              data={Color}
              onChangeText={value => this.setBikeData('color', value)}
            />
          </View>
          <TouchableHighlight
            style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton]}
            onPress={() => {
              if (!addBikeState.uriSet) {
                Alert.alert('Picture is mandatory!');
                return;
              }
              const stolen = radios.type[0].selected;
              if (stolen) {
              // TODO: SET PREVIEW STATE TO SHOW STOLEN
              } else {
              // TODO: SET PREVIEW STATE TO SHOW FOUND
              }
              uploadBikeToServer(addBikeState.imgToUploadUri, bikeData, authState.jwt[0]);
              navigation.navigate('Browser');
            }}
          >
            <Text style={styles.greenButtonText}>Submit</Text>
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
  }).isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
  imgUploadInit: PropTypes.func.isRequired,
  uploadBikeToServer: PropTypes.func.isRequired,
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
