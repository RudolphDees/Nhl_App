import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import query_athena from '../aws/athena_query';
import nhlTeamColors from '../content/TeamColors';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import Team from '../types/Team';
import Player from '../types/Player';


const StatsScreen = () => {
  const [teams, setTeams] = useState([]); // State to store the list of teams
  const [selectedTeam, setSelectedTeam] = useState('All'); // State to store the selected team
  const [tableData, setTableData] = useState([]); // State to store table data
  const [filteredTableData, setFilteredTableData] = useState([]); // State to store filtered table data

  // Function to fetch the team list
  const fetchTeamList = async () => {
    try {
      const response = await fetch('https://api-web.nhle.com/v1/standings/now');


      const data = await response.json();

      const teamList = data.standings.map((team: Team, index: Float) => ({
        id: index + 1,
        name: team.teamName.default,
        abr: team.teamAbbrev
      }));

      setTeams(teamList);
    } catch (error) {
      console.error('Error fetching team list:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
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
  const sortTable = (criteria: string) => {
    const sortedData = [...filteredTableData].sort((a: Player, b: Player) => {
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
      console.log("Selected team is undefined, setting to All")
      setFilteredTableData(tableData); // If 'All' is selected, show all data
      return;
    }
    const filtered = tableData.filter((item: Player) =>
      (item.abr === selectedTeam.default) // Ensure team filter is applied
    );
    setFilteredTableData(filtered); // Update the filtered data
  }

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>Name</Text>
      <Text style={styles.headerCell}>Points</Text>
      <Text style={styles.headerCell}>Goals</Text>
      <Text style={styles.headerCell}>Assists</Text>
      <Text style={styles.headerCell}>Shots</Text>
      <Text style={styles.headerCell}>Games Played</Text>
    </View>
  );

  const renderTableRow = ({item}: { item: Player }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell} numberOfLines={2}>{item.first_name + " " + item.last_name}</Text>
      <Text style={styles.cell}>{parseInt(item.goals) + parseInt(item.assists)}</Text>
      <Text style={styles.cell}>{item.goals}</Text>
      <Text style={styles.cell}>{item.assists}</Text>
      <Text style={styles.cell}>{item.shots}</Text>
      <Text style={styles.cell}>{item.gp}</Text>
    </View>
  );

  return (
    <View style={[styles.container,      
     { backgroundColor: selectedTeam === 'All' ? 'white' : nhlTeamColors[selectedTeam.default] || 'white' },
  ]}>
      <Picker
        selectedValue={selectedTeam}
        onValueChange={(item) => {setSelectedTeam(item)}}
        style={styles.picker}
      >
        <Picker.Item key={0} label="All teams" value="All"/>
        {teams.map((team: {id: number; name: string; abr: string}) => (
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
        style={styles.table}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white' // Use the selected team's color as background
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    color: 'white',
    marginBottom: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  table: {
    marginTop: 20,
    backgroundColor: 'black',
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
    padding: 5,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    flexWrap: 'nowrap',
  },
});

export default StatsScreen;