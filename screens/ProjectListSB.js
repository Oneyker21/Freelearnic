import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';
import CustomText from '../utils/CustomText';

//prueba

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Projects'));
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projezcts: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <CustomText style={styles.projectTitle} fontFamily="Roboto">{item.title}</CustomText>
          <CustomText style={styles.projectStatus} fontFamily="Roboto">{item.projectStatus}</CustomText>
          <CustomText style={styles.projectType} fontFamily="OpenSans">{item.projectType}</CustomText>
          <CustomText style={styles.projectUser} fontFamily="OpenSans">{item.clientID}</CustomText> 
          <View style={styles.priceContainer}>
            <CustomText style={styles.projectPrice} fontFamily="Roboto">
              Rango precio: 
              <CustomText fontFamily="OpenSans">
                {item.minPrice ? `\$${item.minPrice}` : 'No especificado'}
                {' - '}
                {item.maxPrice ? `\$${item.maxPrice}` : 'No especificado'}
              </CustomText>
            </CustomText>
          </View>
          
          <CustomText style={styles.projectDescription} fontFamily="OpenSans">{item.description}</CustomText>
          <CustomText style={styles.projectFechaEntrega} fontFamily="OpenSans">
            Fecha Estimada de Entrega: {item.estimatedDeliveryDate ? item.estimatedDeliveryDate : 'No especificada'}
          </CustomText>
          
        </View>
      )}
    />
  );
};


const styles = StyleSheet.create({
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  projectTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  projectDescription: {
    marginVertical: 5,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  projectPrice: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  projectPropuestas: {
    color: '#666',
  },
  projectFechaInicio: {
    color: '#666',
  },
  projectFechaEntrega: {
    color: '#666',
  },
});

export default ProjectList;
