import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../assets/TabBarIcon';
import Browser from '../screens/Browser';
import AddBike from '../screens/AddBike';
import Profile from '../screens/Profile';

const BrowserStack = createStackNavigator({ Browser });

BrowserStack.navigationOptions = {
  tabBarLabel: 'Ads',
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

const NewStack = createStackNavigator({ AddBike });

NewStack.navigationOptions = {
  tabBarLabel: 'New Ad',
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

const ProfileStack = createStackNavigator({ Profile });

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarOptions: {
    activeTintColor: '#44ccad',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
    />
  ),
};


export default createBottomTabNavigator({
  BrowserStack,
  NewStack,
  ProfileStack,
});
