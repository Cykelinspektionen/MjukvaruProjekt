import { createStackNavigator } from 'react-navigation';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import AddBike from '../screens/AddBike';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  AddBike: { screen: AddBike },
},
{
  initialRouteName: 'AddBike',
});

export default AppNavigator;
