import React from 'react';
import { View, Text, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VerificationStatus = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="#15297C" />
      </TouchableOpacity>
        <Image source={require('../assets/img/Freelearnic.png')} style={styles.logo} />
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
  },
  backButton: {
    position: 'absolute', 
    top: 10,              
    marginTop: 30,
    left: 20,       
    zIndex: 1
  },
});

export default VerificationStatus;
