import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VerificationStatus = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <Image source={require('../assets/Freelearnic.png')} style={styles.logo} />
      <Text style={styles.text}>Usuario en estado de verificación</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '50%',
    paddingBottom: '100%',
    alignItems: 'center',
    backgroundColor: '#f6f6f6'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  }
});

export default VerificationStatus;
