import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import query_athena from '../aws/athena_query';

const StatsScreen = () => {
  const [teams, setTeams] = useState([]); // State to store the list of teams
  const [selectedTeam, setSelectedTeam] = useState(''); // State to store the selected team
  const [selectedStat, setSelectedStat] = useState(''); // State to store the selected stat
  const [tableData, setTableData] = useState([]); // State to store table data
  const [sortCriteria, setSortCriteria] = useState(''); // State to store the sorting criteria

  // Function to fetch the team list
  const fetchTeamList = async () => {
    try {
      const response = await fetch(baseURL);
      const data = await response.json();

      const teamList = data.standings.map((team, index) => ({
        id: index + 1,
        name: team.teamName.default,
      }));

      setTeams(teamList);
    } catch (error) {
      console.error('Error fetching team list:', error);
    }
  };

  useEffect(() => {
    fetchTeamList(); // Fetch the team list when the component mounts
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (selectedTeam === 'All') {
          if (selectedStat === 'Skaters') {
            data = await query_athena(`SELECT * FROM nhl_skater_data`);
          } else if (selectedStat === 'Goalies') {
            data = await query_athena(`SELECT * FROM nhl_goalie_data`);
          }
        } else {
          if (selectedStat === 'Skaters') {
            data = await query_athena(`SELECT * FROM nhl_skater_data s
              JOIN nhl_team_data t ON t.abr = s.abr
              WHERE t.name = '${selectedTeam}'`);
          } else if (selectedStat === 'Goalies') {
            data = await query_athena(`SELECT * 
              FROM nhl_goalie_data s
              JOIN nhl_team_data t ON t.abr = s.abr
              WHERE t.name = '${selectedTeam}'`);
          }
        }
        setTableData(data); // Update table data
        console.log('Query Result:', data); // Log the query result
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (selectedStat !== '' && selectedTeam !== '') {
      fetchData(); // Fetch data when selected team or stat changes
    }
  }, [selectedTeam, selectedStat]);

  // Function to sort the table data
  const sortTable = (criteria) => {
    const sortedData = [...tableData].sort((a, b) => {
      if (criteria === 'goals') {
        return b.goals - a.goals; // Sort by goals in descending order
      } else if (criteria === 'shots') {
        return b.shots - a.shots; // Sort by shots in descending order
      }
      return 0;
    });
    setTableData(sortedData); // Update the table data with sorted data
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>First Name</Text>
      <Text style={styles.headerCell}>Last Name</Text>
      <Text style={styles.headerCell}>Goals</Text>
      <Text style={styles.headerCell}>Shots</Text>
    </View>
  );

  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.first_name}</Text>
      <Text style={styles.cell}>{item.last_name}</Text>
      <Text style={styles.cell}>{item.goals}</Text>
      <Text style={styles.cell}>{item.shots}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedTeam}
        onValueChange={(itemValue) => setSelectedTeam(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a team" value="" />
        <Picker.Item key={0} label="All" value="All" />
        {teams.map((team) => (
          <Picker.Item key={team.id} label={team.name} value={team.name} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedStat}
        onValueChange={(itemValue) => setSelectedStat(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a category" value="" />
        <Picker.Item key={1} label="Skaters" value="Skaters" />
        <Picker.Item key={2} label="Goalies" value="Goalies" />
      </Picker>
      <View style={styles.sortButtons}>
        <Button title="Sort by Goals" onPress={() => sortTable('goals')} />
        <Button title="Sort by Shots" onPress={() => sortTable('shots')} />
      </View>
      <FlatList
        data={tableData}
        ListHeaderComponent={renderTableHeader}
        renderItem={renderTableRow}
        keyExtractor={(item, index) => index.toString()}
        style={styles.table}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default StatsScreen;