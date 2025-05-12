import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import ScoreList from '../content/ScoreList';

const ScoresScreen = () => {
  const [date, setDate] = useState(0);
  const [canSwipe, setCanSwipe] = useState(true);

  // Define the swipe gesture
  const swipeGesture = Gesture.Pan()
    .enabled(canSwipe) // Enable or disable the gesture based on `canSwipe`
    .onFinalize((event) => {
      if (event.translationX > 50) {
        // Swipe right: Go to the previous day
        handleSwipeLeft()
      } else if (event.translationX < -50) {
        // Swipe left: Go to the next day
        handleSwipeRight()
      }
    });

    const handleSwipeLeft = () => {
      setDate((prevDate) => prevDate - 1);
    };
  
    const handleSwipeRight = () => {
      setDate((prevDate) => prevDate + 1);
    };

  const setCanSwipe_Callback = (value: bool) => {
    setCanSwipe(value); 
  }

  // Calculate the current date based on the offset
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + date);
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const strMonth = String(futureDate.getMonth() + 1);
  const day = String(futureDate.getDate()).padStart(2, '0');
  const strDay = String(futureDate.getDate());

  const formattedDate = `${futureDate.toLocaleDateString('en-US', { weekday: 'short' })} - ${strMonth}/${strDay}`;

  return (
    <GestureHandlerRootView style={styles.container}>
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.screenContainer}>
        {/* Header with Navigation Buttons */}
        <View style={styles.header}>
          <View style={styles.navButton}>
            <Button title="<-" onPress={() => setDate((prevDate) => prevDate - 1)} color="black" />
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={styles.navButton}>
            <Button title="->" onPress={() => setDate((prevDate) => prevDate + 1)} color="black" />
          </View>
        </View>

        {/* Score List */}
        <ScoreList year={year} month={month} day={day} setCanSwipe={setCanSwipe_Callback}/>
      </View>
    </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ScoresScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'grey',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navButton: {
    width: 50,
  },
  dateContainer: {
    width: 240,
    alignItems: 'center',
  },
  dateText: {
    marginHorizontal: 70,
    fontSize: 18,
    color: 'black',
  },
});