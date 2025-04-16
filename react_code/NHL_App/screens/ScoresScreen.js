import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScoreList from '../content/ScoreList';

const ScoresScreen = () => (
  <View style={ScoreScreenStyle.screenContainer}>
    <ScoreList/>
  </View>
);

export default ScoresScreen;

const ScoreScreenStyle = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4
  }
})