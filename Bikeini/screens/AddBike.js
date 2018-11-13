import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableHighlight, TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RadioGroup from 'react-native-radio-buttons-group';
import { Dropdown } from 'react-native-material-dropdown';
import { ImagePicker } from 'expo';
import permissions from '../utilities/permissions';

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
});

class ReportStolen extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      myBikeImg: false,
      Title: '',
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
    this.cameraRollPermission();
    this.pickImage();
  }

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      console.log(result.uri);
      this.setState({ myBikeImg: result.uri });
    }
  };

  render() {
    // This is so weird, following is considered correct according to ESlint running airbnb, why?
    const { myBikesState, navigation } = this.props;
    const {
      Title, Type, Color, Brand, Size, hasCameraPermission, hasCameraRollPermission,
    } = this.state;

    const { myBikeImg } = this.state;
    console.log(myBikesState);
    console.log(hasCameraPermission, hasCameraRollPermission);
    return (
      <View style={styles.container}>
        <Text>
          Add a picture of your bike
        </Text>
        <View style={styles.rowContainer}>
          <View>
            {!myBikeImg && <Image source={defaultBike} /> }
            {myBikeImg && <Image source={{ uri: myBikeImg }} style={{ width: 200, height: 200 }} />}
          </View>
          <View>
            <View style={styles.rowContainer}>
              <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton]} onPress={this.startCameraRoll}>
                <Text style={styles.loginText}>ADD FROM ALBUM</Text>
              </TouchableHighlight>
              <Image
                source={cameraImg}
              />
            </View>
            <View style={styles.rowContainer}>
              <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton]} onPress={() => navigation.navigate('Camera')}>
                <Text style={styles.loginText}>TAKE A PHOTO</Text>
              </TouchableHighlight>
              <Image
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
      </View>
    );
  }
}

ReportStolen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  myBikesState: PropTypes.shape({
    missingID: PropTypes.array.isRequired,
    retrievedID: PropTypes.array.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { myBikesState } = state;
  return { myBikesState };
};

export default connect(mapStateToProps)(ReportStolen);
