import { createStackNavigator } from 'react-navigation';
import TabNavigator from './BottomNavigator';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import ResetPassword from '../screens/ResetPassword';
import Camera from '../screens/Camera';
import Location from '../screens/Location';
import BikeInformation from '../screens/BikeInformation';
import PinMap from '../screens/PinMap';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  ResetPassword: { screen: ResetPassword },
  Camera: { screen: Camera },
  Location: {
    screen: Location,
    navigationOptions: {
      headerLeft: null,
    },
  },
  BikeInformation: { screen: BikeInformation },
  PinMap: { screen: PinMap },
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
},
{
  initialRouteName: 'Login',
});

export default AppNavigator;
