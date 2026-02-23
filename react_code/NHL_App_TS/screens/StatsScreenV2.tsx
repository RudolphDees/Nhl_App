import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import StatLeaderList from '../content/StatLeaderboards';
import EdgeStatLeaderList from '../content/EdgeStatLeaderboards';
import { ai_query } from '../functions/ai_query';

const StatsScreenV2 = () => {
  const [aiThinking, setAiThinking] = useState(false);
  const scrollViewRef = useRef(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.sectionHeader}>Goals</Text>
        </View>
        <View>
          <StatLeaderList stat="goals" />
        </View>
        <View>
          <Text style={styles.sectionHeader}>Points</Text>
        </View>
        <View>
          <StatLeaderList stat="points" />
        </View>
        <View>
          <Text style={styles.sectionHeader}>Assists</Text>
        </View>
        <View>
          <StatLeaderList stat="assists" />
        </View>
        <View>
          <Text style={styles.sectionHeader}>Plus/Minus</Text>
        </View>
        <View>
          <StatLeaderList stat="plusMinus" />
        </View>
        <View>
          <Text style={styles.sectionHeader}>Edge Stats</Text>
        </View>
        <View>
          <EdgeStatLeaderList />
        </View>
        <View>
          <Text style={styles.sectionHeader}>{aiThinking ? "AI Thinking..." : "AI Questions"}</Text>
          <TextInput
            style={styles.aiTextInput}
            placeholder="Ask a question..."
            placeholderTextColor="#aaa"
            onSubmitEditing={(event) => {
              const userRequest = event.nativeEvent.text;
              setAiThinking(true);
              ai_query(userRequest).then((response) => {
                setAiThinking(false);
                // Scroll to the bottom of the ScrollView after the AI response is received
                Alert.alert("AI Response", "" + response, [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("OK Pressed");
                    },
                  },
                ]);
              });
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  sectionHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aiTextInput: {
    backgroundColor: 'grey',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    marginBottom: 20,
    color: 'white',
  },
});

export default StatsScreenV2;