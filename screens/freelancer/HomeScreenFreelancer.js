import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreenFreelancer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Freelearnic</Text>
      <Text style={styles.subtitle}>Encuentra oportunidades y crece con nosotros</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreenFreelancer;
