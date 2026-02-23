import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SvgUri }  from 'react-native-svg';
import PlayerCard from './PlayerCard';

var baseURL = ''

const StatLeaderList = ({stat}: {stat: string}) => {
    const [apiDataLoaded, setApiDataLoaded] = useState(false);
    const [playerCardList, setPlayerCardList] = useState<any[]>([]);

    async function gatherData() {
      try {
        var count = 1
        console.log("Page has been reloaded")
        var tempPlayerCardList: any[] = []
        baseURL = `https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=${stat}&limit=5`
        console.log("Fetching data from URL:", baseURL)
        let response = await fetch(baseURL)
        var dataString = await response.json()
        
        if (!dataString[stat]) {
          console.error(`No data found for stat: ${stat}`);
          setApiDataLoaded(true);
          return;
        }
        
        dataString[stat].forEach((player: any, index: number) => {
          tempPlayerCardList.push(<PlayerCard key={index} firstName={player.firstName.default} lastName={player.lastName.default} teamAbbrev={player.teamAbbrev} number={player.sweaterNumber} position={player.position} image={player.headshot} value={player.value} />) 
            count++; 
        });
      setPlayerCardList(tempPlayerCardList);
      setApiDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiDataLoaded(true);
      }
    }
    useEffect(() => {
      gatherData()
    }, [stat]);

    return (
        <View style={styles.container}>
            {apiDataLoaded ? playerCardList : <Text style={{color: 'white'}}>Loading...</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderWidth: 2,
    width: '100%',
    flexDirection: 'column'
  }

});

export default StatLeaderList;
