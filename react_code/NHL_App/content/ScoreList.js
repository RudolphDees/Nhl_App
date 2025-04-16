import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SvgUri }  from 'react-native-svg';


var baseURL = 'https://api-web.nhle.com/v1/score/'

var scoreData = []




const ScoreList = () => {
    const [apiDataLoaded, setApiDataLoaded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    async function fetchMyAPI() {
      var scoreDataTemp = []
      var liveScoreData = []
      var count = 1
      const currentDate = new Date();
      console.log("Page has been reloaded")

      // Get year, month, and day components
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
      const day = String(currentDate.getDate()).padStart(2, '0');

      // Format the date as yyyy-mm-dd
      const formattedDate = `${year}-${month}-${day}`;
      for (i = 0; i<3; i++){
        var scoreDataDailyTempObject = []
        dailyURL = baseURL + `${year}-${month}-${String(currentDate.getDate() + i).padStart(2, '0')}`
        console.log(dailyURL)
        let response = await fetch(dailyURL)
        var dataString = await response.json()
        
        // const cleanedResponseData = dataString.replace(/Array/g, '');
        dataString.games.forEach(game => {
            const timestamp = new Date(game.startTimeUTC);
  
            const options = { timeZone: "America/New_York", hour12: false };
            const formattedTime = timestamp.toLocaleString("en-US", options);
  
            const [_, hour, minute] = formattedTime.match(/(\d+):(\d+)/);
            if (hour > 12) {
              var time = hour - 12 + ":" + minute + " pm";
            } else if (hour == 12) {
              var time = hour + ":" + minute + " pm";
            } else {
              var time = hour + ":" + minute + " am";
            }
            if (game.gameState == 'LIVE'){
              var period = game.period
              var timeLeft = game.clock.timeRemaining
              if (period == 1){
                time = period + "st " + timeLeft
              }else if (period == 2){
                time = period + "nd " + timeLeft
              }else if (period == 3){
                time = period + "rd " + timeLeft
              }
            }
            scoreDataDailyTempObject.push({
                id: count,
                date: game.gameDate.substring(5),
                time: time,
                homeTeam: game.homeTeam.abbrev,
                awayTeam: game.awayTeam.abbrev,
                homeTeamScore: game.homeTeam.score,
                awayTeamScore: game.awayTeam.score,
                homeTeamIcon: game.homeTeam.logo,
                awayTeamIcon: game.awayTeam.logo
            }) 
            count++; 
        });
        scoreDataDailyTempObject = scoreDataDailyTempObject
        scoreDataDailyTempObject.forEach(object => {
          scoreDataTemp.push(object)
        })
      }
      scoreData = scoreDataTemp
      setApiDataLoaded(true);

  }

    const fetchData = () => {
      setRefreshing(true);
      setTimeout(() => {
        fetchMyAPI();
        setRefreshing(false);
      }, 2000);
      
    };

    useEffect(() => {
        fetchMyAPI()
    });


    const renderItem = ({ item }) => (
        <View style={styles.bufferContainer}>
            <View style={styles.scoreContainer}>
                <View style={styles.teamScoreContainer}>
                    <View style={styles.homeScore}>
                        <SvgUri
                                width="50"
                                height="50"
                                uri={item.homeTeamIcon}
                            />
                        <View style={{width: 8}}/>
                        <Text>{item.homeTeam}</Text>
                    </View>
                    <Text style={styles.scoreText}>{item.homeTeamScore}</Text>
                </View>
                <View style={styles.timeDate}>
                    <Text>{item.date}</Text>
                    <Text>{item.time}</Text>
                </View>
                <View style={styles.teamScoreContainer}>
                    <View style={styles.awayScore}>
                        <Text>{item.awayTeam}</Text>
                        <View style={{width: 8}}/>
                        <SvgUri
                                width="50"
                                height="50"
                                uri= {item.awayTeamIcon}
                            />  
                    </View>
                    <Text style={styles.scoreText}>{item.awayTeamScore}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <FlatList
        data={scoreData}
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
    marginTop: 5,
    padding: 10,
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
  homeScore: {
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
  }

});

export default ScoreList;
