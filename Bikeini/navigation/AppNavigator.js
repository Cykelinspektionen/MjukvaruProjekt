import { createStackNavigator } from 'react-navigation';
import TabNavigator from './BottomNavigator';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import ResetPassword from '../screens/ResetPassword';
import Camera from '../screens/Camera';
import Location from '../screens/Location';
import BikeInformation from '../screens/BikeInformation';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  ResetPassword: { screen: ResetPassword },
  Camera: { screen: Camera },
  Location: { screen: Location },
  BikeInformation: { screen: BikeInformation },
  TabNavigator,
},
{
  initialRouteName: 'Login',
  headerMode: 'none',
});

export default AppNavigator;
