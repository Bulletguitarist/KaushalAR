import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      }}
    >
      <Text style={{fontSize:30}}>
        KaushalAR
      </Text>

      <Button
        title="Start AR Training"
        onPress={() => navigation.navigate('AR')}
      />

      <Button
        title="AI Mentor"
        onPress={() => navigation.navigate('Mentor')}
      />
    </View>
  );
}