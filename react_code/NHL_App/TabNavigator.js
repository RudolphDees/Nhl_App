import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScoresScreen from './screens/ScoresScreen';
import StandingsScreen from './screens/StandingsScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: 'black', // Set the background color of the tab bar
    height: 60, // Ensure the tab bar has enough height
    borderTopWidth: 2,
    borderTopColor: 'grey',
  },
};

const createTabOptions = (name) => {
  return {
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    headerStyle: {
      height: 70,
      backgroundColor: 'grey',
    },
    tabBarIcon: ({ focused }) => {
      return (
        <View style={styles.tabButton(focused)}>
          <Text style={styles.tabText(focused)}>{name}</Text>
        </View>
      );
    },
  };
};

const styles = StyleSheet.create({
  tabButton: (focused) => ({
    flex: 1,
    width: '100', // Ensure the button fills the width of the tab
    height: '100', // Ensure the button fills the height of the tab
    backgroundColor: focused ? 'grey' : 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: focused ? 'black' : 'grey',
    borderWidth: 2,
  }),
  tabText: (focused) => ({
    color: focused ? 'black' : 'white',
    fontWeight: 'bold',
    fontSize: 18, // Adjust font size for better visibility
    textAlign: 'center', // Center the text horizontally
  }),
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
      component={StatsScreen}
      options={createTabOptions('Stats')}
    />
  </Tab.Navigator>
);

export default TabNavigator;