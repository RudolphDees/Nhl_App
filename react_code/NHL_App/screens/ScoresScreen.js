import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ScoreList from '../content/ScoreList';

const ScoresScreen = () => {
  const [date, setDate] = useState(0);

  // Move the date calculations inside the render logic
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + date);
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '0');

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
        <Button title="<-" onPress={() => setDate(date - 1)} color={'black'}/>
        <Text style={{ marginHorizontal: 70, fontSize: 20, color: 'black' }}>
          {month}/{day}/{year}
        </Text>
        <Button title="->" onPress={() => setDate(date + 1)} color={'black'}/>
      </View>
      <ScoreList year={year} month={month} day={day} />
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

const query_athena = () => {
  print("Test")
  fetch('https://878r18dvk4.execute-api.us-east-1.amazonaws.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "SELECT * FROM nhl_skater_data WHERE abr = 'TBL' LIMIT 100"
    })
  })
  .then(res => res.json())
  .then(data => console.log("Athena results:", data))
  .catch(err => console.error("Error:", err));    
}

