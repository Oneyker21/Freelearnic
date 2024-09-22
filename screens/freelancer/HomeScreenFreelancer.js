import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ProjectList from '../ProjectList'; // Asegúrate de que la ruta sea correcta
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

const HomeScreenFreelancer = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer de los parámetros de la ruta
  const [loading, setLoading] = useState(true);
  const [freelancerData, setFreelancerData] = useState(null);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const docRef = doc(db, 'Freelancers', freelancerId); // Cambia 'Freelancers' por el nombre de tu colección
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFreelancerData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching freelancer data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Freelearnic, {freelancerData.nombres}!</Text>
      <Text style={styles.subtitle}>Encuentra oportunidades y crece con nosotros</Text>
      <ProjectList freelancerId={freelancerId} /> {/* Pasar el ID del freelancer a ProjectList */}
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
