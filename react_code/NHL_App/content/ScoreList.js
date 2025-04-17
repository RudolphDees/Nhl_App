import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SvgUri } from 'react-native-svg';

const baseURL = 'https://api-web.nhle.com/v1/score/';

const ScoreList = ({ year, month, day }) => {
  const [scoreData, setScoreData] = useState([]); // Use state for score data
  const [refreshing, setRefreshing] = useState(false);

  async function fetchMyAPI() {
    try {
      const formattedDate = `${year}-${month}-${day}`;
      const dailyURL = `${baseURL}${formattedDate}`;
      console.log(`Fetching data from: ${dailyURL}`);

      const response = await fetch(dailyURL);
      const dataString = await response.json();

      const scoreDataTemp = dataString.games.map((game, index) => {
        const timestamp = new Date(game.startTimeUTC);
        const options = { timeZone: 'America/New_York', hour12: false };
        const formattedTime = timestamp.toLocaleString('en-US', options);

        const [_, hour, minute] = formattedTime.match(/(\d+):(\d+)/);
        let time;
        if (hour > 12) {
          time = `${hour - 12}:${minute} pm`;
        } else if (hour == 12) {
          time = `${hour}:${minute} pm`;
        } else {
          time = `${hour}:${minute} am`;
        }

        return {
          id: index + 1,
          date: game.gameDate.substring(5),
          time,
          homeTeam: game.homeTeam.abbrev,
          awayTeam: game.awayTeam.abbrev,
          homeTeamScore: game.homeTeam.score,
          awayTeamScore: game.awayTeam.score,
          homeTeamIcon: game.homeTeam.logo,
          awayTeamIcon: game.awayTeam.logo,
        };
      });

      setScoreData(scoreDataTemp); // Update state directly
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchData = () => {
    setRefreshing(true);
    fetchMyAPI().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchMyAPI(); // Fetch data when year, month, or day changes
  }, [year, month, day]);

  const renderItem = ({ item }) => (
    <View style={styles.bufferContainer}>
      <View style={styles.scoreContainer}>
        <View style={styles.teamScoreContainer}>
          <View style={styles.homeScore}>
            <SvgUri width="50" height="50" uri={item.homeTeamIcon} />
            <View style={{ width: 8 }} />
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
            <View style={{ width: 8 }} />
            <SvgUri width="50" height="50" uri={item.awayTeamIcon} />
          </View>
          <Text style={styles.scoreText}>{item.awayTeamScore}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={scoreData} // Use state for FlatList data
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
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
    flexDirection: 'row',
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
    width: '100%',
  },
  timeDate: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeScore: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  awayScore: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  teamScoreContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default ScoreList;