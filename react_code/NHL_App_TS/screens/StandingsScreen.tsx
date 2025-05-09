import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StandingsList from '../content/StandingsList';

const StandingsScreen = () => (
  <View style={{flex: 1}}>
    <View style={{
      flex: .06,
      backgroundColor: "black",
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2
    }}>

      <View>

      <View style={StandingScreenStyles.row}>
        <View style={{
          width: '40%'
        }}>
        </View>

        <View style={StandingScreenStyles.cell}>
            <Text style={StandingScreenStyles.text}>PTS</Text>
        </View>

        <View style={StandingScreenStyles.cell}>
            <Text style={StandingScreenStyles.text}>Record</Text>
        </View>

        <View style={StandingScreenStyles.cell}>
            <Text style={StandingScreenStyles.text}>GP</Text>
        </View>
        
        <View style={StandingScreenStyles.cell}>
            <Text style={StandingScreenStyles.text}>P%</Text>
        </View>                        
      </View>
      </View>

    </View>
    <View style={{
      flex: 1,
      backgroundColor: "black"
    }}>
    <StandingsList/>
      
    </View>
  </View>
);

export default StandingsScreen;

const StandingScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
  row: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white'
  }
})


