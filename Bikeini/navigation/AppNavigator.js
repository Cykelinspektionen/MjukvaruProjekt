import { createStackNavigator } from 'react-navigation';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
},
{
  initialRouteName: 'Login',
});

export default AppNavigator;
