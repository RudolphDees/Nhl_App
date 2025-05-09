import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SvgUri }  from 'react-native-svg';

var standingData = []
var baseURL = 'https://api-web.nhle.com/v1/standings/now'

function roundToDecimal(number, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}

const StandingsList = () => {
    const [apiDataLoaded, setApiDataLoaded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    async function gatherData() {
      var tempStandings = []
      var count = 1
      const currentDate = new Date();
      console.log("Page has been reloaded")


      let response = await fetch(baseURL)
      var dataString = await response.json()
      
      // const cleanedResponseData = dataString.replace(/Array/g, '');
      dataString.standings.forEach(team => {
        tempStandings.push({
              id: count,
              abr: team.teamAbbrev.default,
              icon: team.teamLogo,
              points: team.points,
              wins: team.wins,
              losses: team.losses,
              ot: team.otLosses,
              gamesPlayed: team.gamesPlayed,
          }) 
          count++; 
      });
    standingData = tempStandings
    setApiDataLoaded(true);

  }

    const fetchData = () => {
      setRefreshing(true);
      setTimeout(() => {
        gatherData();
        setRefreshing(false);
      }, 2000);
      
    };

    useEffect(() => {
      var standingData = []

      gatherData()
    });


    const renderItem = ({ item }) => (
        <View style={styles.bufferContainer}>
            <View style={styles.scoreContainer}>
                <View style={styles.teamScoreContainer}>
                    <View style={styles.row}>
                      <View style={styles.cell}>
                        <Text>{item.id}</Text>
                      </View>
                        <SvgUri
                                width="35"
                                height="35"
                                uri={item.icon}
                            />
                      <View style={styles.cell}>
                          <Text>{item.abr}</Text>
                      </View>

                      <View style={styles.cell}>
                          <Text>{item.points}</Text>
                      </View>

                      <View style={styles.cell}>
                          <Text style={{fontSize: 12}}>{item.wins}-{item.losses}-{item.ot}</Text>
                      </View>

                      <View style={styles.cell}>
                          <Text>{item.gamesPlayed}</Text>
                      </View>
                      
                      <View style={styles.cell}>
                          <Text>{roundToDecimal(item.points/(item.gamesPlayed*2), 3).toString().substring(1)}%</Text>
                      </View>                      
                      
                      
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <FlatList
        data={standingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.scoreListContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchData}
            colors={['#1e90ff']} // Set the color of the loading indicator
          />
        }
        />
    );
};

const styles = StyleSheet.create({
  scoreContainer: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderWidth: 2,
    width: '100%',
    flexDirection: 'row'
  },
  bufferContainer: {
    width: '100%',
    marginTop: 1,
    marginBottom: 1,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  scoreListContainer: {
    flex: 1,
    width: '100%'
  },
  timeDate: {
    flex: .6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  awayScore: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'

  },
  teamScoreContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  cell: {
    flex: 1,
    height: '100%',
    borderEndWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default StandingsList;
