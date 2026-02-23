import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScoresScreen from '../screens/ScoresScreen';
import StandingsScreen from '../screens/StandingsScreen';
import StatsScreen from '../screens/StatsScreen';
import StatsScreenV2 from '../screens/StatsScreenV2';

const Tab = createBottomTabNavigator();

const screenOptions: object = {
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: 'black', // Set the background color of the tab bar
    height: 60, // Ensure the tab bar has enough height
    borderTopWidth: 2,
    borderTopColor: 'grey',
    marginBottom: Platform.OS === 'android' ? 25 : 0, // Add margin only on Android
  },
};

const createTabOptions = (name: string) => {
  return {
    headerTitleStyle: {
      fontSize: 24,
      color: 'grey'
    },
    headerStyle: {
      height: 40,
      backgroundColor: 'grey',
    },
    tabBarIcon: ({focused}: { focused: boolean }) => {
      return (
        <View style={getTabButtonStyle(focused)}>
          <Text style={getTabTextStyle(focused)}>{name}</Text>
        </View>
      );
    },
  };
};

const styles = StyleSheet.create({
  tabButtonBase: {
    flex: 1,
    width: 100, // Ensure the button fills the width of the tab
    height: 100, // Ensure the button fills the height of the tab
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  tabTextBase: {
    fontWeight: 'bold',
    fontSize: 18, // Adjust font size for better visibility
    textAlign: 'center', // Center the text horizontally
  },
});

const getTabButtonStyle = (focused: boolean) => ({
  ...styles.tabButtonBase,
  backgroundColor: focused ? 'grey' : 'black',
  borderColor: focused ? 'black' : 'grey',
});

const getTabTextStyle = (focused: boolean) => ({
  ...styles.tabTextBase,
  color: focused ? 'black' : 'white',
});

const TabNavigator = () => (
  <Tab.Navigator screenOptions={screenOptions}>
    <Tab.Screen
      name="Scores"
      component={ScoresScreen}
      options={createTabOptions('Scores')}
    />
    <Tab.Screen
      name="Standings"
      component={StandingsScreen}
      options={createTabOptions('Standings')}
    />
    <Tab.Screen
      name="Stats"
      component={StatsScreenV2}
      options={createTabOptions('Stats')}
    />
  </Tab.Navigator>
);

export default TabNavigator;