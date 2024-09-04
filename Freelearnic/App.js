import React from "react";
import { View, StyleSheet } from 'react-native';
import LoginScreen from "./screens/LoginScreen";



function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  )
}



const App = () => {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;