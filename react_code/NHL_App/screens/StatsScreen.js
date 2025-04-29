import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import query_athena from '../aws/athena_query';
<<<<<<< HEAD
import nhlTeamColors from '../content/TeamColors';

const StatsScreen = () => {
  const [teams, setTeams] = useState([]); // State to store the list of teams
  const [selectedTeam, setSelectedTeam] = useState('All'); // State to store the selected team
  const [tableData, setTableData] = useState([]); // State to store table data
  const [filteredTableData, setFilteredTableData] = useState([]); // State to store filtered table data

=======

const StatsScreen = () => {
  const [teams, setTeams] = useState([]); // State to store the list of teams
  const [selectedTeam, setSelectedTeam] = useState(''); // State to store the selected team
  const [selectedStat, setSelectedStat] = useState(''); // State to store the selected stat
  const [tableData, setTableData] = useState([]); // State to store table data
  const [sortCriteria, setSortCriteria] = useState(''); // State to store the sorting criteria
>>>>>>> origin/main

  // Function to fetch the team list
  const fetchTeamList = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('https://api-web.nhle.com/v1/standings/now');
=======
      const response = await fetch(baseURL);
>>>>>>> origin/main
      const data = await response.json();

      const teamList = data.standings.map((team, index) => ({
        id: index + 1,
        name: team.teamName.default,
<<<<<<< HEAD
        abr: team.teamAbbrev
=======
>>>>>>> origin/main
      }));

      setTeams(teamList);
    } catch (error) {
      console.error('Error fetching team list:', error);
    }
  };

<<<<<<< HEAD
=======
  useEffect(() => {
    fetchTeamList(); // Fetch the team list when the component mounts
  }, []);
>>>>>>> origin/main

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        const data = await query_athena(`SELECT * FROM nhl_skater_data`);
        setTableData(data); // Set the fetched data to tableData state
        setFilteredTableData(data); // Initialize filtered data with all data
      } catch (error) {
        console.error('Error fetching data:', error);
        setTableData([]);
        setFilteredTableData([]);
      }
    };
    if (teams.length === 0) {
      fetchTeamList(); // Fetch the team list when the component mounts
    }
    if (tableData.length === 0) {
      console.log("We need to fetch the data")
      fetchData(); // Fetch data when the component mounts
    }else{
      console.log("We already have the data")
      filterTable(); // Filter the table data based on selected team
    }
  }, [selectedTeam]);

  // Function to sort the table data
  const sortTable = (criteria) => {
    const sortedData = [...filteredTableData].sort((a, b) => {
      if (criteria === 'goals') {
        return b.goals - a.goals; // Sort by goals in descending order
      } if (criteria === 'shots') {
        return b.shots - a.shots; // Sort by shots in descending order
      } else if (criteria === 'assists') {
        return b.assists - a.assists; // Sort by shots in descending order
      }
      return 0;
    });
    setFilteredTableData(sortedData); // Update the table data with sorted data
  };

  const filterTable = () => {
    console.log("Filtering the table data for team: " + (JSON.stringify(selectedTeam)))
    if (selectedTeam.default == undefined){
      setFilteredTableData(tableData); // If 'All' is selected, show all data
      return;
    }
    const filtered = tableData.filter((item) =>
      (item.abr === selectedTeam.default) // Ensure team filter is applied
    );
    setFilteredTableData(filtered); // Update the filtered data
    sortTable('goals'); // Sort the filtered data by goals
=======
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
>>>>>>> origin/main
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
<<<<<<< HEAD
      <Text style={styles.headerCell}>Name</Text>
      <Text style={styles.headerCell}>Goals</Text>
      <Text style={styles.headerCell}>Assists</Text>
=======
      <Text style={styles.headerCell}>First Name</Text>
      <Text style={styles.headerCell}>Last Name</Text>
      <Text style={styles.headerCell}>Goals</Text>
>>>>>>> origin/main
      <Text style={styles.headerCell}>Shots</Text>
    </View>
  );

  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow}>
<<<<<<< HEAD
      <Text style={styles.cell}>{item.first_name + " " + item.last_name}</Text>
      <Text style={styles.cell}>{item.goals}</Text>
      <Text style={styles.cell}>{item.assists}</Text>
=======
      <Text style={styles.cell}>{item.first_name}</Text>
      <Text style={styles.cell}>{item.last_name}</Text>
      <Text style={styles.cell}>{item.goals}</Text>
>>>>>>> origin/main
      <Text style={styles.cell}>{item.shots}</Text>
    </View>
  );

  return (
<<<<<<< HEAD
    <View style={[styles.container,      
     { backgroundColor: selectedTeam === 'All' ? 'white' : nhlTeamColors[selectedTeam.default] || 'white' },
  ]}>
      <Picker
        selectedValue={selectedTeam}
        onValueChange={(item) => {setSelectedTeam(item)}}
        style={styles.picker}
      >
        <Picker.Item key={0} label="All teams" value="All"/>
        {teams.map((team) => (
          <Picker.Item key={team.id} label={team.name} value={team.abr} />
          )
        )}
      </Picker>
      <View style={styles.sortButtons}>
        <Button title="Goals" onPress={() => sortTable('goals')} />
        <Button title="Assists" onPress={() => sortTable('assists')} />
        <Button title="Shots" onPress={() => sortTable('shots')} />
      </View>
      <FlatList
        data={filteredTableData}
        ListHeaderComponent={renderTableHeader}
        renderItem={renderTableRow}
=======
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
>>>>>>> origin/main
        style={styles.table}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
<<<<<<< HEAD
    backgroundColor: 'white' // Use the selected team's color as background
=======
    backgroundColor: 'white',
>>>>>>> origin/main
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: 'white',
    backgroundColor: 'black',
    color: 'white',
=======
    borderColor: 'grey',
    backgroundColor: '#f0f0f0',
>>>>>>> origin/main
    marginBottom: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  table: {
    marginTop: 20,
<<<<<<< HEAD
    backgroundColor: 'black',
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
    padding: 5,
    alignItems: 'center',
=======
    padding: 10,
>>>>>>> origin/main
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
<<<<<<< HEAD
    color: 'white',
=======
>>>>>>> origin/main
  },
});

export default StatsScreen;