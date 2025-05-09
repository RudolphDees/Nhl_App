import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Linking } from 'react-native';
import { SvgUri } from 'react-native-svg';
import nhlTeamColors from './TeamColors';
import Game, { Goal } from '../types/Game';
import SeriesStatus from '../types/SeriesStatus';

// Function to open external links safely
const openLink = (url: string) => {
  if (url) {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  }
};

const baseURL = 'https://api-web.nhle.com/v1/score/';

const TeamInfo = ({ icon, score }: {icon: string, score: string}) => (
  <View style={styles.teamInfo}>
    <SvgUri width="70" height="70" uri={icon} />
    <Text style={styles.scoreText}>{score}</Text>
  </View>
);


const PlayoffSeriesStatus = ({ seriesStatus }: { seriesStatus: SeriesStatus}) => {
  if (!seriesStatus) return null;

  if (seriesStatus.topSeedWins > seriesStatus.bottomSeedWins) {
    return(
      <Text style={{ fontSize: 14 }}>
        {seriesStatus.topSeedWins} - {seriesStatus.bottomSeedWins} {seriesStatus.topSeedTeamAbbrev} Leads
      </Text>
    )}
    else if (seriesStatus.topSeedWins < seriesStatus.bottomSeedWins) {
      return(
        <Text style={{ fontSize: 14 }}>
          {seriesStatus.bottomSeedWins} - {seriesStatus.topSeedWins} {seriesStatus.bottomSeedTeamAbbrev} Leads
        </Text>
      )
    }else {
      return(
        <Text style={{ fontSize: 14 }}>
          {seriesStatus.topSeedWins} - {seriesStatus.bottomSeedWins}
        </Text>
      )
    }
}


const ScoreList = ({ year, month, day }: { year: string, month: string, day: string }) => {
  const [scoreData, setScoreData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchMyAPI = useCallback(async () => {
    setLoading(true);
    try {
      const formattedDate = `${year}-${month}-${day}`;
      const response = await fetch(`${baseURL}${formattedDate}`);
      const data = await response.json();
  
      const scoreDataTemp = data.games.map((game: Game, index: number) => {
        const timestamp = new Date(game.startTimeUTC);
        const formattedTime = timestamp.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
        const [, hourStr, minute] = formattedTime.match(/(\d+):(\d+)/);
        const hour = parseInt(hourStr, 10);
  
        let time = `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'pm' : 'am'}`;
        return { ...game, time, id: index + 1};
      });
      setScoreData(scoreDataTemp);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [year, month, day]);

  const fetchData = () => {
    setRefreshing(true);
    fetchMyAPI().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);


  
  const renderItem = ({ item }: { item: Game }) => {
    console.log(JSON.stringify(item)); // Debugging to verify the structure of the item
    if (!item || !item.homeTeam || !item.awayTeam) {
      return null;
    }
  
    return (
      <View style={styles.bufferContainer}>
      <View style={styles.scoreContainer}>
        <View style={styles.teamScoreContainer}>
          <TeamInfo
            icon={item.homeTeam.logo}
            score={item.homeTeam.score}
          />
        </View>
        <View style={styles.timeDate}>
          {item.seriesStatus ? (
              <Text style={{fontSize: 16}}>{item.seriesStatus.seriesAbbrev}: Gm {item.seriesStatus.gameNumberOfSeries}</Text>
            ) : null}
          {item.seriesStatus ? (
            <PlayoffSeriesStatus seriesStatus={item.seriesStatus}/>
          ) : null}




          {(item.gameState === 'LIVE' || item.gameState === 'CRIT') && (
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              {item.period > 3 ? (
                <Text style={{fontSize: 18}}>OT {item.period - 3}</Text>
              ) : (
                <Text style={{fontSize: 18}}>Period: {item.period}</Text>
              )}
              <Text style={{fontSize: 18}}>{item.clock.timeRemaining}</Text>
            </View>
          )}
          {(item.gameState === 'FUT' || item.gameState === 'PRE') && <Text style={{fontSize: 18}}>{item.time}</Text>}
          {(item.gameState === 'OFF') && (
            item.gameOutcome.lastPeriodType === 'OT' ? (
                <Text style={{ fontSize: 16 }}>FINAL/OT</Text>
              ) : (
                <Text style={{ fontSize: 16 }}>FINAL</Text>
              )
            )}        
        </View>
        <View style={styles.teamScoreContainer}>
          <TeamInfo
            icon={item.awayTeam.logo}
            score={item.awayTeam.score}
          />
        </View>
      </View>
  
      {((item.gameState === 'LIVE' || item.gameState === 'CRIT' || item.gameState === 'OFF') && item.goals.length > 0) && (
        <View style={styles.gameStatusContainer}>
          <View style={{ height: 5 }} />
          <ScrollView
            style={{ width: '100%' }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {item.goals.map((goal, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  borderColor: nhlTeamColors[goal.teamAbbrev] || 'black',
                  borderWidth: 2,
                  padding: 5,
                  backgroundColor: '#b6b6b6',
                }}
                onTouchEnd={() => openLink(goal.highlightClipSharingUrl)}
              >
                <Text style={{ fontSize: 18, marginBottom: 5 }}>
                  -- {goal.teamAbbrev} --
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>Per: {goal.period}  -  </Text>
                  <Text>{goal.timeInPeriod}</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {goal.name.default} ({goal.goalsToDate})
                </Text>
                {goal.assists.map((assist, idx) => (
                  <Text key={idx} style={{ fontSize: 14 }}>
                    {assist.name.default}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
          <View style={{ height: 5 }} />
        </View>
      )}
    </View>
    );
  };

  return (
    <View style={{ flex: 1, width: '100%', backgroundColor: 'black' }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading scores...</Text>
        </View>
      ) : (
        <FlatList
          data={scoreData}
          renderItem={renderItem}
          keyExtractor={(item: Game) => item.id?.toString() || ''}
          style={styles.scoreListContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} colors={['#1e90ff']} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    width: '100%',
    flexDirection: 'row',
  },
  gameStatusContainer: {
    backgroundColor: 'grey',
    alignItems: 'center',
    borderWidth: 2,
    width: '100%',
  },
  bufferContainer: {
    width: '100%',
    marginTop: 5,
    padding: 10,
    alignItems: 'center',
  },
  scoreListContainer: {
    flex: 1,
    width: '100%',
  },
  timeDate: {
    flex: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  teamInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamScoreContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default ScoreList;
