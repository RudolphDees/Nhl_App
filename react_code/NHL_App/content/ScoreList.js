import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Linking } from 'react-native';
import { SvgUri } from 'react-native-svg';
import nhlTeamColors from '../content/TeamColors';

// Function to open external links safely
const openLink = (url) => {
  if (url) {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  }
};

const baseURL = 'https://api-web.nhle.com/v1/score/';

const TeamInfo = ({ icon, abbrev, score }) => (
  <View style={styles.teamInfo}>
    <SvgUri width="70" height="70" uri={icon} />
    <Text style={styles.scoreText}>{score}</Text>
  </View>
);


const PlayoffSeriesStatus = ({ seriesStatus }) => {
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


const ScoreList = ({ year, month, day }) => {
  const [scoreData, setScoreData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyAPI = useCallback(async () => {
    try {
      const formattedDate = `${year}-${month}-${day}`;
      const response = await fetch(`${baseURL}${formattedDate}`);
      const data = await response.json();

      const scoreDataTemp = data.games.map((game, index) => {
        const timestamp = new Date(game.startTimeUTC);
        const formattedTime = timestamp.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
        const [, hourStr, minute] = formattedTime.match(/(\d+):(\d+)/);
        const hour = parseInt(hourStr, 10);

        let time = `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'pm' : 'am'}`;

        const baseGameData = {
          id: index + 1,
          date: game.gameDate.substring(5),
          time,
          homeTeam: game.homeTeam.abbrev,
          awayTeam: game.awayTeam.abbrev,
          homeTeamScore: game.homeTeam.score,
          awayTeamScore: game.awayTeam.score,
          homeTeamIcon: game.homeTeam.logo,
          awayTeamIcon: game.awayTeam.logo,
          status: game.gameState,
          fullGameData: game
        };

        const activeStates = new Set(['LIVE', 'CRIT', 'OFF']);
        if (activeStates.has(game.gameState)) {
          return {
            ...baseGameData,
            timeRemaining: game.clock?.timeRemaining,
            period: game.period,
            goals: game.goals || [],
          };
        }

        return baseGameData;
      });

      setScoreData(scoreDataTemp);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [year, month, day]);

  const fetchData = () => {
    setRefreshing(true);
    fetchMyAPI().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);


  
  const renderItem = ({ item }) => (
    <View style={styles.bufferContainer}>
      <View style={styles.scoreContainer}>
        <View style={styles.teamScoreContainer}>
          <TeamInfo
            icon={item.homeTeamIcon}
            abbrev={item.homeTeam}
            score={item.homeTeamScore}
            isHome={true}
          />
        </View>
        <View style={styles.timeDate}>
          {item.fullGameData.seriesStatus ? (
              <Text style={{fontSize: 16}}>{item.fullGameData.seriesStatus.seriesAbbrev}: Gm {item.fullGameData.seriesStatus.gameNumberOfSeries}</Text>
            ) : null}
          {item.fullGameData.seriesStatus ? (
            <PlayoffSeriesStatus seriesStatus={item.fullGameData.seriesStatus}/>
          ) : null}




          {(item.status === 'LIVE' || item.status === 'CRIT') && (
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              {item.period > 3 ? (
                <Text style={{fontSize: 18}}>OT {item.period - 3}</Text>
              ) : (
                <Text style={{fontSize: 18}}>Period: {item.period}</Text>
              )}
              <Text style={{fontSize: 18}}>{item.timeRemaining}</Text>
            </View>
          )}
          {item.status === 'FUT' && <Text style={{fontSize: 18}}>{item.time}</Text>}
          {(item.status === 'OFF' || item.status === 'PRE') && (
            item.fullGameData.gameOutcome.lastPeriodType === 'OT' ? (
                <Text style={{ fontSize: 16 }}>FINAL/OT</Text>
              ) : (
                <Text style={{ fontSize: 16 }}>FINAL</Text>
              )
            )}        
        </View>
        <View style={styles.teamScoreContainer}>
          <TeamInfo
            icon={item.awayTeamIcon}
            abbrev={item.awayTeam}
            score={item.awayTeamScore}
          />
        </View>
      </View>
  
      {(item.status === 'LIVE' || item.status === 'CRIT' || item.status === 'OFF') && (
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

  return (
    <FlatList
      data={scoreData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.scoreListContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} colors={['#1e90ff']} />}
    />
  );
};

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
