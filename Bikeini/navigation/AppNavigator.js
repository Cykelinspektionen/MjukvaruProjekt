import { createStackNavigator } from 'react-navigation';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import AddBike from '../screens/AddBike';
import Camera from '../screens/Camera';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  AddBike: { screen: AddBike },
  Camera: { screen: Camera },
},
{
  initialRouteName: 'AddBike',
});

export default AppNavigator;
