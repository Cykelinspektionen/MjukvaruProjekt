import { createStackNavigator } from 'react-navigation';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import AddBike from '../screens/AddBike';
import Camera from '../screens/Camera';
import Location from '../screens/Location';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  AddBike: { screen: AddBike },
  Camera: { screen: Camera },
  Location: { screen: Location },
},
{
  initialRouteName: 'Login',
});

export default AppNavigator;
