import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore';


const ScreenTypeUser = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('RegisterFreelancer')} // Make sure to pass freelancerId here
                >
                    <Text style={styles.buttonText}>Iniciar como vendedor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('RegisterClient')} // Make sure to pass freelancerId here
                >
                    <Text style={styles.buttonText}>Contratar freelancer</Text>
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
    button: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      marginVertical: 5, // Spacing between buttons
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

  export default ScreenTypeUser;







