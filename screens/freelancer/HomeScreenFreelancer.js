import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ProjectList from '../ProjectList'; // Asegúrate de que la ruta sea correcta
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

const HomeScreenFreelancer = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer de los parámetros de la ruta
  console.log('Freelancer ID en HomeScreenFreelancer:', freelancerId); // Verifica que el ID se recolecte correctamente
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const docRef = doc(db, 'Freelancer', freelancerId); // Cambia 'Freelancers' por el nombre de tu colección
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Aquí puedes manejar los datos si es necesario
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
      <ProjectList route={{ params: { freelancerId } }} />
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
});

export default HomeScreenFreelancer;
