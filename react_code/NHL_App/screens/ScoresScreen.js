import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import ScoreList from '../content/ScoreList';

const ScoresScreen = () => {
  const [date, setDate] = useState(0);
  const [gestureEnabled, setGestureEnabled] = useState(true); // State to control gesture


  // Define the swipe gesture
  const swipeGesture = Gesture.Pan()
  .enabled(gestureEnabled) // Enable or disable the gesture
  .onEnd((event) => {
    if (event.translationX > 50) {
      // Swipe right: Go to the previous day
      setDate(date - 1);
    } else if (event.translationX < -50) {
      // Swipe left: Go to the next day
      setDate(date + 1);
    }
  });

  // Move the date calculations inside the render logic
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + date);
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const strMonth = String(futureDate.getMonth() + 1);
  const day = String(futureDate.getDate()).padStart(2, '0');
  const strDay = String(futureDate.getDate());

  return (
    <View style={ScoreScreenStyle.screenContainer}>
      <View
        style={{
          backgroundColor: 'grey',
          width: '100%',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <View style={{ width: 50 }}>
          <Button title="<-" onPress={() => setDate(date - 1)} color={'black'}/>
        </View>
        <View style={{ width: 240, alignItems: 'center' }}>
          <Text style={{ marginHorizontal: 70, fontSize: 20, color: 'black' }}>
            {`${futureDate.toLocaleDateString('en-US', { weekday: 'short' })} - ${strMonth}/${strDay}`}
          </Text>
        </View>
        <View style={{ width: 50 }}>
          <Button title="->" onPress={() => setDate(date + 1)} color={'black'}/>
        </View>
      </View>
      <ScoreList year={year} month={month} day={day} 
          onScrollStart={() => setGestureEnabled(false)} // Disable gesture on scroll start
          onScrollEnd={() => setGestureEnabled(true)} // Enable gesture on scroll end
      />
    </View>
  );
};

export default ScoresScreen;

const ScoreScreenStyle = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
});

