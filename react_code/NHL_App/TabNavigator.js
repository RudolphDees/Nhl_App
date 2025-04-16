// TabNavigator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScoresScreen from './screens/ScoresScreen';
import StandingsScreen from './screens/StandingsScreen';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
}

const createTabOptions = (name) => {
  return {
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    headerStyle: {
      height: 70,
      backgroundColor: 'grey',
    },
    tabBarIcon: ({focused}) => {
      return(
        <View style={ focused ? {
          width: '100%',
          backgroundColor: 'grey',
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: 'black',
          height: 60
        } : {
          width: '100%',
          backgroundColor: 'black',
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: 'grey',
          height: 60
        }}>
          <Text style={focused ? {
            color: 'black'
          } : {
            color: 'white'
          }}>
            {name}
          </Text>
        </View>
      )
    }
  }
}


const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={screenOptions}
  >
    <Tab.Screen 
      name="Scores" 
      component={ScoresScreen} 
      options={createTabOptions("Scores")}
    />
    <Tab.Screen 
      name="Standings" 
      component={StandingsScreen} 
      options={createTabOptions("Standings")}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});


export default TabNavigator;
