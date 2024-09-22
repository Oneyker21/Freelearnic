import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';

const HomeScreenSb = () => {
  const navigation = useNavigation();
  const [freelancerId, setFreelancerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerId = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Freelancer'));
        if (!querySnapshot.empty) {
          const firstFreelancer = querySnapshot.docs[0]; // Obtener el primer freelancer
          setFreelancerId(firstFreelancer.id); // Almacenar el ID del primer freelancer
        } else {
          console.log('No freelancers found');
        }
      } catch (error) {
        console.error('Error fetching freelancers: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerId();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Crear Proyecto')} // Navegar al componente CreateProject
        >
          <Text style={styles.buttonText}>Crear Proyecto</Text>
        </TouchableOpacity>
        
        {/* Botón para navegar al perfil del freelancer */}
        {freelancerId && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Profile Freelancer', { freelancerId })} // Navegar al componente FreelancerProfile
          >
            <Text style={styles.buttonText}>Ver Perfil del Freelancer</Text>
          </TouchableOpacity>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5, // Espaciado entre botones
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreenSb;