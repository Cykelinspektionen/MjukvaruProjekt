import React from 'react';
import { Platform, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../assets/TabBarIcon';
import Browser from '../screens/Browser';
import AddBike from '../screens/AddBike';
import Profile from '../screens/Profile';
import Gamification from '../screens/Gamification';

const BrowserStack = createStackNavigator({ Browser });

//https://github.com/react-navigation/react-navigation/issues/766

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

const GameStack = createStackNavigator({ Gamification });

GameStack.navigationOptions = {
  tabBarLabel: 'Game',
  tabBarOptions: {
    activeTintColor: '#44ccad',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-trophy' : 'md-trophy'}
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
    <View>
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      />
      <View style={{position: 'absolute', right: 1, top: 1, backgroundColor: 'red', width: 7, height: 7, borderRadius: 9}}></View>
    </View>
  ),
};


export default createBottomTabNavigator({
  BrowserStack,
  NewStack,
  GameStack,
  ProfileStack,
}, {

});
