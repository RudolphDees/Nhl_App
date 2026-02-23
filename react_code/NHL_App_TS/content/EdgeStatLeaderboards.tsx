import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SvgUri }  from 'react-native-svg';
import PlayerCard from './PlayerCard';

var url = 'https://api-web.nhle.com/v1/edge/skater-landing/20252026/2'
var statArray = ["maxSkatingSpeed", "hardestShot", "totalDistanceSkated", "highDangerSOG"] 

const EdgeStatLeaderList = () => {
    const [apiDataLoaded, setApiDataLoaded] = useState(false);
    const [playerCardList, setPlayerCardList] = useState<any[]>([]);

    async function gatherData() {
      try {
        var count = 1
        console.log("Page has been reloaded")
        var tempPlayerCardList: any[] = []
        console.log("Fetching data from URL:", url)
        let response = await fetch(url)
        var dataString = await response.json()
        
        if (!dataString["leaders"]) {
          console.error(`No data found for this stat`);
          setApiDataLoaded(true);
          return;
        }
        statArray.forEach((stat, index) => {
          var statData = dataString["leaders"][stat]
          if (stat === "maxSkatingSpeed") {
            statData.value = `${statData.skatingSpeed.imperial} mph`
            tempPlayerCardList.push(<Text style={{color: 'white', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>Max Skating Speed</Text>)
          } else if (stat === "hardestShot") {
            statData.value = `${statData.shotSpeed.imperial} mph`
            tempPlayerCardList.push(<Text style={{color: 'white', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>Hardest Shot</Text>)
          } else if (stat === "totalDistanceSkated") {
            statData.value = `${statData.distanceSkated.imperial} ft`
            tempPlayerCardList.push(<Text style={{color: 'white', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>Total Distance Skated</Text>)
          } else if (stat === "highDangerSOG") {
            statData.value = `${statData.sog}`
            tempPlayerCardList.push(<Text style={{color: 'white', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>High Danger SOG</Text>)
          }
          tempPlayerCardList.push(<PlayerCard key={index} firstName={statData.player.firstName.default} lastName={statData.player.lastName.default} teamAbbrev={statData.player.team.abbrev} number={statData.player.sweaterNumber} position={statData.player.position} image={statData.player.headshot} value={statData.value} />) 
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
    }, []);

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

export default EdgeStatLeaderList;
