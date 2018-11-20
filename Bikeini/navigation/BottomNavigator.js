import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../assets/TabBarIcon';
import Browser from '../screens/Browser';
import AddBike from '../screens/AddBike';

const BrowserStack = createStackNavigator({
  Browser: { screen: Browser },
}, { headerMode: 'screen' });

BrowserStack.navigationOptions = {
  tabBarLabel: 'Ads',
  title: 'Heej',
  headerMode: 'none',
  tabBarOptions: {
    activeTintColor: '#44ccad',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bicycle' : 'md-bicycle'}
    />
  ),
};

const NewStack = createStackNavigator({
  New: AddBike,
}, { headerMode: 'screen' });

NewStack.navigationOptions = {
  tabBarLabel: 'New Ad',
  headerMode: 'none',
  tabBarOptions: {
    activeTintColor: '#44ccad',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-add-circle' : 'md-add-circle'}
    />
  ),
};


export default createBottomTabNavigator({
  BrowserStack,
  NewStack,
});
