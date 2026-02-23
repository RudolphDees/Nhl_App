import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

const PlayerCard = ({ firstName, lastName, teamAbbrev, number, position, image, value }: { firstName: string, lastName: string, teamAbbrev: string, number: number, position: string, image: string, value: number }) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  return(
    <View style={styles.card}>
        <View style={styles.bumpers} />
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} width={50} height={50} />
        </View>
        <View style={{width: 2, backgroundColor: 'black', margin: 4}} />
        <View style={styles.infoContainer}>
            <View>

                <Text style={styles.name}>{firstName}</Text>
                <Text style={styles.name}>{lastName}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center'}}>
                    <Text style={styles.team}>{teamAbbrev}</Text>
                    <Text style={styles.number}>#{number}</Text>
                    <Text style={styles.position}>{position}</Text>
                </View>
            </View>
        </View>
        <Text style={styles.value}>{value}</Text>
        <View style={styles.bumpers} />
    </View>
  )
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'grey',
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: 2,

  },
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  team: {
    fontSize: 10,
    textAlign: 'center',
  },
  number: {
    fontSize: 10,
    textAlign: 'center',
  },
  position: {
    fontSize: 10,
  },
  value: {
    fontSize: 16,
    textAlign: 'right',
    alignSelf: 'center',
    flex: 1,
  },
  bumpers: {
    width: 4,
  }
});

export default PlayerCard;