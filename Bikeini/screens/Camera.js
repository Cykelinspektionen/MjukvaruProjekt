import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo';
import { connect } from 'react-redux';
import permissions from '../utilities/permissions';


class CameraPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };
    this.cameraPermission = permissions.cameraPermission.bind(this);
    this.cameraPermission();
  }

  render() {
    const { hasCameraPermission, type } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} type={type}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({
                  type: type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                });
              }}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}
              >
                {' '}
                Flip
                {' '}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

export default connect()(CameraPage);
