import React from 'react';
import {
  Platform, View, Text, StyleSheet, Image,
} from 'react-native';
import {
  Constants, Location, Permissions, MapView,
} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as mapActions from '../navigation/actions/MapActions';


const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    height: 48,
    width: 48,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
});

const bikeIcon = require('../assets/images/biker.png');


// TO ACTUALLY USE THIS WHEN DEPLOYED THERE IS MORE STEPS! Especially on ANDROID.
class PinMap extends React.Component {
  state = {
    errorMessage: null,
    marker: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.getLocationAsync();
    }
  }

  getLocationAsync = async () => {
    const { setMapLocation } = this.props;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    const location = await Location.getCurrentPositionAsync({});
    const geocode = await Location.reverseGeocodeAsync(location.coords);
    setMapLocation({ ...location.coords, ...geocode[0] });
  };

  onRegionChangeComplete = async (region) => {
    const { setMapLocation } = this.props;
    const geocode = await Location.reverseGeocodeAsync({ latitude: region.latitude, longitude: region.longitude });
    setMapLocation({ ...region, ...geocode[0] });
  }

  render() {
    const { mapState } = this.props;
    console.log(mapState);

    if (mapState.marker.showMarker) {
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={mapState.marker}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          <MapView.Marker
            coordinate={{ latitude: mapState.marker.latitude, longitude: mapState.marker.longitude }}
          />
        </MapView>
      );
    }

    if (mapState.loadedCurrPos) {
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={mapState}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          <Image style={[styles.markerFixed, styles.marker]} source={bikeIcon} />
        </MapView>
      );
    }
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}

/*
Marker implementation (real).
<MapView.Marker
  // draggable
  coordinate={{ latitude: mapState.latitude, longitude: mapState.longitude }}
  // onDragEnd={e => setMapLocation(e.nativeEvent.coordinate )}
/>
*/

PinMap.propTypes = {
  mapState: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired,
  }).isRequired,
  setMapLocation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { mapState } = state;
  return { mapState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...mapActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(PinMap);
