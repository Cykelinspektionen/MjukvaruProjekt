import { createStackNavigator } from 'react-navigation';
import createBottomTabNavigator from './BottomNavigator';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import Camera from '../screens/Camera';
import Location from '../screens/Location';

const AppNavigator = createStackNavigator({
  Login: { screen: Login, navigationOptions: { title: 'header2' } },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  Camera: { screen: Camera },
  Location: { screen: Location },
  withBottomNavigator: { screen: createBottomTabNavigator },
},
{
  initialRouteName: 'Login',
  headerMode: 'none',
});

export default AppNavigator;
