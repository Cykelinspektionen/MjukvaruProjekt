import { createStackNavigator } from 'react-navigation';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import Browser from '../screens/Browser';
import Location from '../screens/Location';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  Browser: { screen: Browser },
  Location: { screen: Location },
},
{
  initialRouteName: 'Login',
});

export default AppNavigator;
