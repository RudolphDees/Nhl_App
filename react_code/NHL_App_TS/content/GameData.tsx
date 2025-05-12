import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const GameData = ({ GameID }: { GameID: number }) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async (GameID: number) => {
    try {
      const response = await fetch(`https://api-web.nhle.com/v1/wsc/game-story/${GameID}`);
      const result = await response.json();
      result.summary.teamGameStats = result.summary.teamGameStats.map((dataPoint: any) => {
        if (dataPoint.category === 'sog') {
          return { ...dataPoint, category: 'SOG' };
        }
        if (dataPoint.category === 'hits') {
          return { ...dataPoint, category: 'Hits' };
        }
        if (dataPoint.category === 'blockedShots') {
          return { ...dataPoint, category: 'Blocks' };
        }
        if (dataPoint.category === 'giveaways') {
          return { ...dataPoint, category: 'Giveaways' };
        }
        if (dataPoint.category === 'Takeaways') {
          return { ...dataPoint, category: 'Takeaways' };
        }
        if (dataPoint.category === 'pim') {
          return { ...dataPoint, category: 'PIM' };
        }
        if (dataPoint.category === 'powerPlayPctg') {
          return { ...dataPoint, category: 'PP%' };
        }
        if (dataPoint.category === 'powerPlay') {
          return { ...dataPoint, category: 'Power Plays' };
        }
        if (dataPoint.category === 'faceoffWinningPctg') {
          return {
            awayValue: parseFloat(dataPoint.awayValue.toFixed(2)),
            homeValue: parseFloat(dataPoint.homeValue.toFixed(2)),
            category: 'Face Off %',
          };
        }
        return dataPoint; // Return the original object if no changes are made
      });
      setData(result); // Set the fetched data to state
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(GameID);
  }, [GameID]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Game Data...</Text>
      </View>
    );
  }

  if (!data || !data.summary || !data.summary.teamGameStats) {
    return (
      <View style={styles.centered}>
        <Text>No game data available for Game ID: {GameID}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    {data.summary.threeStars.length > 0 && (
    <View style={styles.table}>
    <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.headerCell]}>Three Stars of the Game</Text>
    </View>
    {data.summary.threeStars.map((star: any, index: number) => (
        <View key={index} style={styles.tableRow}>
        <Text style={styles.tableCell}>{star.star}</Text>
        <Text style={styles.tableCell}>{star.name} ({star.teamAbbrev})</Text>
        <Text style={styles.tableCell}>
            {star.position === 'G' && `Save %: ${star.savePctg} - GAA: ${star.goalsAgainstAverage}`}
            {star.position !== 'G' && `G: ${star.goals} - A: ${star.assists} - P: ${star.points}`}
            </Text>            
            </View>
    ))}
    </View>
)}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.headerCell]}>Home Team</Text>
          <Text style={[styles.tableCell, styles.headerCell]}>Stat</Text>
          <Text style={[styles.tableCell, styles.headerCell]}>Away Team</Text>
        </View>

        {/* Table Rows */}
        {data.summary.teamGameStats.map((dataPoint: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{dataPoint.homeValue}</Text>
            <Text style={styles.tableCell}>{dataPoint.category}</Text>
            <Text style={styles.tableCell}>{dataPoint.awayValue}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5, // Optional: Add rounded corners
    overflow: 'hidden', // Ensure borders are clean
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: 'grey',
    color: 'black', // Ensure text is visible on grey background
  },
});

export default GameData;