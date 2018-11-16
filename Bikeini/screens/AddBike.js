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
import serverApi from '../utilities/serverApi';

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
      bikeData: {
        title: '',
        imageOfBike: null,
        addType: 'stolen',
        color: '',
        frameNumber: '',
        description: '',
        antiTheftCode: '',
        frameType: 'male',
        basket: 'true',
        rack: 'true',
        mudguard: 'true',
        chainProtection: 'true',
        net: 'true',
        winterTires: 'true',
        // Below is not implemented
        stolen: '',
        found: '',
        location: '',
        keywords: '',
        sport: '',
        tandem: '',
      },
      radios: {
        addType: [
          {
            label: 'Stolen',
            value: 'stolen',
          },
          {
            label: 'Found',
            value: 'found',
          },
        ],
        frameType: [
          {
            label: 'Male',
            value: 'male',
          },
          {
            label: 'Female',
            value: 'female',
          },
        ],
        basket: [
          {
            label: 'Basket',
            value: 'true',
          },
          {
            label: 'No Basket',
            value: 'false',
          },
        ],
        rack: [
          {
            label: 'Rack',
            value: 'true',
          },
          {
            label: 'No Rack',
            value: 'false',
          },
        ],
        mudguard: [
          {
            label: 'Mudguard',
            value: 'true',
          },
          {
            label: 'No Mudguard',
            value: 'false',
          },
        ],
        chainProtection: [
          {
            label: 'Chain protector',
            value: 'true',
          },
          {
            label: 'No chain protector',
            value: 'false',
          },
        ],
        net: [
          {
            label: 'Net',
            value: 'true',
          },
          {
            label: 'No Net',
            value: 'false',
          },
        ],
        winterTires: [
          {
            label: 'Winter tires',
            value: 'true',
          },
          {
            label: 'No winter tires',
            value: 'false',
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

  sendBikeToServer = () => {
    const { addBikeState, authState } = this.props;
    const { bikeData } = this.state;
    const bikeImgData = {
      uri: addBikeState.uriSet,
      name: `${bikeData.addType}.jpg`,
      type: 'image/jpg',
    };
    this.setBikeData('imageOfBike', bikeImgData);
    console.log(bikeData);
    serverApi.fetchApi('addBike', bikeData, 'multipart/form-data;', authState.jwt[0]);
  }

  setBikeData = (attr, value) => {
    const { bikeData } = this.state;
    bikeData[attr] = value;
    this.setState({ bikeData });
  }

  radioUpdater = (change, name) => {
    const { radios } = this.state;
    const selectedButton = radios[name].find(e => e.selected === true);
    this.setBikeData(name, selectedButton.value);
    console.log(selectedButton);
    radios[name] = change;
    this.setState({ radios });
  }

  render() {
    const { addBikeState, navigation } = this.props;
    const {
      bikeData, radios, Color, Brand, Size,
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
            value={bikeData.title}
            onChangeText={text => this.setBikeData('title', text)}
          />
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
            placeholder="Description"
            underlineColorAndroid="transparent"
            value={bikeData.description}
            onChangeText={text => this.setBikeData('description', text)}
          />
          <RadioGroup
            radioButtons={radios.addType}
            onPress={(data) => { this.radioUpdater(data, 'addType'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.frameType}
            onPress={(data) => { this.radioUpdater(data, 'frameType'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.basket}
            onPress={(data) => { this.radioUpdater(data, 'basket'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.rack}
            onPress={(data) => { this.radioUpdater(data, 'rack'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.mudguard}
            onPress={(data) => { this.radioUpdater(data, 'mudguard'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.chainProtection}
            onPress={(data) => { this.radioUpdater(data, 'chainProtection'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.net}
            onPress={(data) => { this.radioUpdater(data, 'net'); }}
            flexDirection="row"
          />
          <RadioGroup
            radioButtons={radios.winterTires}
            onPress={(data) => { this.radioUpdater(data, 'winterTires'); }}
            flexDirection="row"
          />
          <View style={styles.dropdowns}>
            <Dropdown
              label="Color"
              data={Color}
              onChangeText={value => this.setBikeData('color', value)}
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
              if (!addBikeState.uriSet) {
                Alert.alert('Picture is mandatory!');
                return;
              }
              this.sendBikeToServer();
              const stolen = radios.addType[0].selected;
              if (stolen) {
              // SET PREVIEW STATE TO SHOW STOLEN
              } else {
              // SET PREVIEW STATE TO SHOW FOUND
              }
              // clear URI
            // navigation.navigate('PREVIEW ADS!')
            }}
          >
            <Text style={styles.loginText}>Submit</Text>
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
    newBikeID: PropTypes.string.isRequired,
    imgToUploadUri: PropTypes.string.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
  saveImageToState: PropTypes.func.isRequired,
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
