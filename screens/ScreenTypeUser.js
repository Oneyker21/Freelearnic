import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ScreenTypeUser = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="#15297C" />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonFreelancer}
          onPress={() => navigation.navigate('RegisterFreelancer')} // Make sure to pass freelancerId here
        >
          <Text style={styles.buttonTextFree}>Iniciar como vendedor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonClient}
          onPress={() => navigation.navigate('RegisterClient')} // Make sure to pass freelancerId here
        >
          <Text style={styles.buttonTextClient}>Contratar freelancer</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    marginBottom: 20,
  },
  buttonFreelancer: {
    width: '100%',
    height: 50,
    backgroundColor: '#15297C',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
  },

  buttonClient: {
    backgroundColor: null,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 25,
  },
  buttonTextFree: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonTextClient: {
    color: '#4FA5DA',
    fontWeight: 'bold',
    fontSize: 20,
  },
  backButton: {
    position: 'absolute', 
    top: 10,              
    marginTop: 30,
    left: 20,       
    zIndex: 1
  },
});

export default ScreenTypeUser;







