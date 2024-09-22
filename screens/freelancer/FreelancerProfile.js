import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

const FreelancerProfile = ({ route }) => {
  const { freelancerId } = route.params; // Asegúrate de obtener el freelancerId de los parámetros de la ruta
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const docRef = doc(db, 'Freelancer', freelancerId); // Cambia 'Freelancer' por el nombre de tu colección
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

  if (!freelancerData) {
    return <Text>No se encontraron datos del freelancer.</Text>;
  }

  const { nombres, apellidos, nombre_usuario, email, municipio, departamento, nivel, descripcion } = freelancerData;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${nombres} ${apellidos}`}</Text>
      <Text style={styles.subtitle}>Nombre de Usuario: {nombre_usuario}</Text>
      <Text style={styles.subtitle}>Descripción: {descripcion}</Text>
      <Text style={styles.subtitle}>Correo Electrónico: {email}</Text>
      <Text style={styles.subtitle}>Municipio: {municipio}</Text>
      <Text style={styles.subtitle}>Departamento: {departamento}</Text>
      <Text style={styles.subtitle}>Nivel: {nivel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default FreelancerProfile;
